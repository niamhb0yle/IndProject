import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import reportStyles from '../../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import 'firebase/firestore';
import '../api/[...all]';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';


export default function Scope3Report() {
    const [regionalEmissions, setRegionalEmissions] = useState([]);
    const [providerRegions, setProviderRegions] = useState({});
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [totalHours, setTotalHours] = useState(0);
    const [calculateDisplay, setCalculateDisplay] = useState(false);
    const [totalEmissions, setTotalEmissions] = useState(0);
    const [displayCloudservices, setDisplayCloudservices] = useState("No");
    const [reportDates, setReportDates] = useState({startDate:'', dueDate:''});
    const user = auth.currentUser;


    function tryAPICall() {
        fetch('/api/regions/emissions-factors', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setRegionalEmissions(data);
        })
        .catch(error => console.error('Error fetching emissions factors:', error));
    }

    const checkTeam = async () => {
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team
        const teamSnap = await getDoc(teamRef);
        
    
        if (teamSnap.exists()) {
          const startTimestamp = teamSnap.data().CurrentReport.start;
          const dueTimestamp = teamSnap.data().CurrentReport.due;
          const start = startTimestamp.toDate();
          const due = dueTimestamp.toDate();
          const differenceInMilliseconds = Math.abs(startTimestamp - dueTimestamp);
          setTotalHours(differenceInMilliseconds / 3600000);
          console.log(Math.abs(startTimestamp - dueTimestamp))
          setReportDates({startDate: start, dueDate: due})
        } else {
          console.log("No such document!");
        }

        
        setCalculateDisplay(() => true);
        
    };
    
    useEffect(() => {
        if (user) {
          checkTeam();
        }
      }, [user]);

    function populateData(){
        console.log(regionalEmissions);
        const tempProviderRegions = {};

        // loop through each entry in regionalEmissions
        regionalEmissions.forEach((emission) => {
            if (emission.cloudProvider !== "ALI"){ // discard entries under ALI
                const provider = emission.cloudProvider;
                const region = emission.region;
                const mtPerKwHour = emission.mtPerKwHour; // Assuming mtPerKwHour is the property name

                // check if the provider key exists, if not initialize it with an empty object
                if (!tempProviderRegions[provider]) {
                    tempProviderRegions[provider] = {};
                }

                // set the region and its mtPerKwHour value
                tempProviderRegions[provider][region] = mtPerKwHour;
            }
        });

        setProviderRegions(tempProviderRegions);
    }

    function calculate() {
        setTotalEmissions(providerRegions[selectedProvider][selectedRegion] * totalHours); // the unit is metric ton co2e
    }
    
    // if regionalEmissions is updated, then populate regions and cloud providers for user to choose from
    useEffect(() => {
        if (regionalEmissions.length > 0) { // error checking in case api call didn't work
            populateData();
          }
    }, [regionalEmissions]);

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
            <Header title=""/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>

                    <div className={reportStyles.scopeHeadingText}>
                        Scope 1 &rarr;  Scope 2  &rarr; <span style={{color:'black'}}> Scope 3</span>
                    </div>

                    <div className={reportStyles.headingText}>Cloud Computing services</div>
                    <p>Scope 3 tracks indirect emissions from your value chain. Any outsourced cloud computing services for your software fall under this category. By gaining details of your cloud provider & the location of your services which are running, we can make an estimation of the carbon emitted over the period of your report.</p>
                    <p>Do you use cloud computing services from the following three providers: AWS, GCP, AZURE ?</p>
                    <select 
                    value={displayCloudservices} 
                    onChange={(e) => setDisplayCloudservices(e.target.value)}
                    className={reportStyles.inputBoxes}
                    style={{width:'50%'}}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>

                    <div style={{display: displayCloudservices === "Yes" ? "block" : "none"}}>
                        <p>Select your cloud provider:</p>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className={reportStyles.inputBoxes}
                            style={{width:'50%'}}
                        >
                            <option value="">Select a provider</option>
                            {Object.keys(providerRegions).map((provider, index) => (
                            <option key={index} value={provider}>
                                {provider}
                            </option>
                            ))}
                        </select>
                    <br></br>

                    <div style={{display: selectedProvider != "" ? "block" : "none"}}>
                        <p>Select your region:</p>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className={reportStyles.inputBoxes}
                            style={{width:'50%'}}
                        >
                        <option value="">Select a region</option>
                        {selectedProvider && Object.keys(providerRegions[selectedProvider]).map((region, index) => (
                            <option key={index} value={region}>
                                {region}
                        </option>
                        ))}
                        </select>
                    </div>
                    <br></br>

                    <div style={{display: selectedRegion != "" ? "block" : "none"}}>
                        {/*<p>Select a start/end date:</p>
                        <div style={{width:'50%', padding:'10px', display:'inline'}}>
                            <DatePicker
                                showIcon
                                selected={startDate}
                                onChange={(date) => setStartDate(date)} 
                            />
                        </div>

                        <div style={{width:'50%', padding:'10px', display:'inline'}}>
                            <DatePicker
                            showIcon
                            selected={endDate}
                            onChange={(date) => setEndDate(date)} 
                            />
                        </div>
                        */}

                        <div style={{display: selectedRegion != '' ? 'block':'none'}}>
                            <button
                                onClick={calculate}
                                className={reportStyles.nextButton}>
                                Calculate &rarr;
                            </button>
                        </div>
                        
                        <div style={{display: totalEmissions == 0 ? 'none':'block'}}>
                            <p>{totalEmissions} metric ton co2e</p>
                        </div>
                        </div>

                    </div>

                    
                    <button style={{display: selectedProvider == '' ? 'block' :'none'}}
                        onClick={tryAPICall}
                        className={reportStyles.nextButton}>
                        Try api call
                    </button>
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

