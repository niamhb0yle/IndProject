import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import reportStyles from '../../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import Likert from 'react-likert-scale';
import { useEffect, useState } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { db, auth } from "../../firebase";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


export default function SCIReport() {
  const [energyConsumed, setEnergyConsumed] = useState('');
  const [carbonIntensity, setCarbonIntensity] = useState('');
  const [embodiedEmissions, setEmbodiedEmissions] = useState('');
  const [functionalUnit, setFunctionalUnit] = useState('');
  const [sciScore, setSciScore] = useState(null);
  const [questionView, setQuestionView] = useState("ec");
  const [expand, setExpand] = useState(false); // true for hidden
  const [submit, setSubmit] = useState(false);
  const [reportDates, setReportDates] = useState({start:'', due:''});
  const [backToDashboard, setBackToDashboard] = useState(false);



  const expandToggle = () => {
    setExpand(!expand);
  }

  const getReportDates = async () => {
    //get report dates from current report
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team
    const teamSnap = await getDoc(teamRef);
    const start = teamSnap.data().CurrentReport.start.toDate();
    const due = teamSnap.data().CurrentReport.due.toDate();
    setReportDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
  
  }

  useEffect( () => {
    //get report dates from current report
    getReportDates();
  }, [])

  const calculateSCI = () => {
    const operationalEmissions = energyConsumed * carbonIntensity;
    const totalEmissions = operationalEmissions + Number(embodiedEmissions); // Ensure conversion to Number
    const score = totalEmissions / functionalUnit;
    setSciScore(score); // This triggers the useEffect below once state updates
  };
  
  useEffect(() => {
    if (sciScore !== null) {
      sendToFirestore();
    }
  }, [sciScore]);

  const handleSubmit = (event) => {
    if (questionView === 'ec') {
      setQuestionView('ci');
    } else if (questionView === 'ci') {
      setQuestionView('ee');
    } else if (questionView === 'ee') {
      setQuestionView('fu');
    } 
    setExpand(false);
    event.preventDefault();
    setSubmit(false);
  };  

  const validateInput = (input) => {
    if (input !== '') {
      setSubmit(true);
    } else { 
      setSubmit(false);
    }
  }

  const sendToFirestore = async () => {
    const user = auth.currentUser;
    try {
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      const teamRef = userSnap.data().Team
      const teamSnap = await getDoc(teamRef);
      const reportNumber = String(teamSnap.data().CurrentReport.number);
      const reportRef = doc(db, `Teams/${teamRef.id}/Reports`, reportNumber);
  
      await setDoc(userRef, { progress: { SCI: true } }, { merge: true });
  
      await updateDoc(reportRef, {
         "SCI": { 
          "SCI": sciScore,
          "EnergyConsumed": energyConsumed,
          "CarbonIntensity": carbonIntensity,
          "EmbodiedEmissions": embodiedEmissions,
          "FunctionalUnit": functionalUnit,
        } 
      });
  
      console.log("SCI score updated in Firestore successfully.");
      
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }

  return (
  <div>
    <Head>
      <title>Curo</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className={styles.pageContainer}>
      <div className={styles.mainContainer}>
        <SideBar/>

        <div className={styles.dashboard}>
          <Header title="SCI Report"/>
          
          <div className={styles.dashboardContent}>
              <div className={reportStyles.reportContainer}>
                  <div style={{width:'90%', display: questionView === "ec" ? "block" : "none"}}>
                    <div className={reportStyles.headingText}>Please enter the energy consumed by your application in kilowatt hours between the dates {reportDates.start} and {reportDates.due}:</div>
                    <input
                      className={reportStyles.inputBoxes}
                      style={{width:'400px'}}
                      type="number"
                      min="1"
                      value={energyConsumed}
                      onChange={ (e) => {
                        setEnergyConsumed(e.target.value);
                        validateInput(e.target.value);
                      }}
                      placeholder="Energy Consumed (kWh)"
                    />

                    <div onClick={expandToggle} className={reportStyles.expand}>
                      <h1>Unsure of what this means? <FontAwesomeIcon width='2vw' style={{float:'right'}} icon={faChevronDown} /></h1>
                      <div className={`${reportStyles.expandContent} ${expand ? reportStyles.expanded : ''}`}>
                        <p style={{display: expand ? "block" : "none"}}>Energy consumed is the total electrical energy (in kilowatt-hours, kWh) that the hardware running the software system uses over a certain period or for a specific amount of work.</p>
                        <p style={{display: expand ? "block" : "none"}}>It can be measured in various ways depending on the context:
                        In a data center or server environment, it might be the energy reported by the facility or estimated based on the server's power usage and operating time.
                        For cloud-based services, cloud providers often provide metrics or estimates of energy usage for the resources (like virtual machines or cloud functions) utilized.
                        In a desktop or mobile context, it could involve estimating the energy use of the device while running the software.</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className={reportStyles.nextButton}
                      style={{
                        pointerEvents: submit ? 'auto' : 'none',
                        opacity: submit ? '1' : '0.5'
                      }}>
                        Continue &rarr;
                    </button>
                  </div>

                  <div style={{width:'90%', display: questionView === "ci" ? "block" : "none"}}>
                    <div className={reportStyles.headingText}>Please enter the carbon intensity in CO2kg per kilowatt hours of your application:</div>
                    <input
                      className={reportStyles.inputBoxes}
                      style={{width:'400px'}}
                      type="number"
                      min="1"
                      value={carbonIntensity}
                      onChange={(e) => {
                        setCarbonIntensity(e.target.value);
                        validateInput(e.target.value);
                      }}
                      placeholder="Carbon Intensity"
                    />

                    <div onClick={() => expandToggle()} className={reportStyles.expand} style={{width: expand ? "700px" : "400px"}}>
                      <h1>Unsure of what this means?<FontAwesomeIcon width='2vw' style={{float:'right'}} icon={faChevronDown} /></h1>
                      <div className={`${reportStyles.expandContent} ${expand ? reportStyles.expanded : ''}`}>
                        <div style={{display: expand ? "block" : "none"}}>
                          <p>The carbon intensity of electricity is a measure of how much carbon (CO2eq) emissions are produced per kilowatt-hour (kWh) of electricity consumed.</p>
                          <ul>
                            <li><b>API based techniques: </b>This is when you integrate your software with APIs that provide the marginal carbon intensity at runtime or at delayed intervals (i.e every 15 minutes).</li>
                            <li><b>Lookup Carbon Intensity Database / Sources: </b>This is when you get the marginal carbon intensity value from data sources or emission databases.If the marginal carbon intensity is not available at runtime or delayed intervals for a given location/geography, you can go with monthly, quarterly or yearly average emission data based on data availability.</li>
                          </ul> 
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className={reportStyles.nextButton}
                      style={{
                        pointerEvents: submit ? 'auto' : 'none',
                        opacity: submit ? '1' : '0.5'
                      }}>
                        Continue &rarr;
                    </button>
                  </div>

                  <div style={{width:'90%', display: questionView === "ee" ? "block" : "none"}}>
                    <div className={reportStyles.headingText}>Please enter the embodied emissions in kg CO2 of your application:</div>
                    <input
                      className={reportStyles.inputBoxes}
                      style={{width:'400px'}}
                      type="number"
                      value={embodiedEmissions}
                      min="1"
                      onChange={(e) => {
                        setEmbodiedEmissions(e.target.value);
                        validateInput(e.target.value);
                      }}
                      placeholder="Embodied Emissions"
                      
                    />

                    <div onClick={() => expandToggle()} className={reportStyles.expand} style={{width: expand ? "700px" : "400px"}}>
                      <h1>Unsure of what this means?<FontAwesomeIcon width='2vw' style={{float:'right'}} icon={faChevronDown} /></h1>
                      <div className={`${reportStyles.expandContent} ${expand ? reportStyles.expanded : ''}`}>
                        <div style={{display: expand ? "block" : "none"}}>
                          <p>Embodied carbon (also known as embedded carbon) is the amount of carbon emitted during the creation and disposal of a hardware device.</p>
                          <p>There are a couple ways to measure this:</p>
                          <ul>
                            <li><b>Lookup Embodied Database: </b>This is when you look up available database/sources to get embodied carbon for the server/hardware resources used by the software application.</li>
                            <li><b>Manual Approach: </b>This is when you use manual processes to get the embodied carbon for the server/hardware resources used by the software application.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className={reportStyles.nextButton}
                      style={{
                        pointerEvents: submit ? 'auto' : 'none',
                        opacity: submit ? '1' : '0.5'
                      }}>
                        Continue &rarr;
                    </button>
                    </div>

                    <div style={{width:'90%', display: questionView === "fu" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please enter the functional unit of the calculation:</div>
                      <input
                        className={reportStyles.inputBoxes}
                        style={{width:'400px'}}
                        min="1"
                        type="number"
                        value={functionalUnit}
                        onChange={(e) => {
                          setFunctionalUnit(e.target.value);
                          validateInput(e.target.value);
                        }}
                        placeholder="Functional Unit"
                        
                      />

                      <div onClick={() => expandToggle()} className={reportStyles.expand} style={{width: expand ? "700px" : "400px"}}>
                        <h1>Unsure of what this means?<FontAwesomeIcon width='2vw' style={{float:'right'}} icon={faChevronDown} /></h1>
                        <div className={`${reportStyles.expandContent} ${expand ? reportStyles.expanded : ''}`}>
                          <div style={{display: expand ? "block" : "none"}}>
                            <p>The functional unit defines how your application scales. For instance, if your application scales by APIs then choose API as your functional unit.</p>
                            <p>For instance, if you are running on the cloud, you can get the total API request/second from the cloud metrics of your API gateway. You can get the data from a production instance or carry out lab-based testing (i.e stress testing) to get how much CO2e is emitted per unit of the functional unit.</p>
                          </div>
                        </div>
                      </div>


                      <Link href='../dimension-pages/SCI' 
                      className={reportStyles.reportBtn}
                      onClick={calculateSCI}
                      style={{
                        pointerEvents: submit ? 'auto' : 'none',
                        opacity: submit ? '1' : '0.5'
                      }}
                    >
                      Complete report &rarr;
                    </Link>

                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>

    <style jsx>{`
      main {
        padding: 2rem 0;
      }
    `}</style>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          Segoe UI,
          Roboto,
          Oxygen,
          Ubuntu,
          Cantarell,
          Fira Sans,
          Droid Sans,
          Helvetica Neue,
          sans-serif;
      }
      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
);
}

