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
import emissionFactors from './scope2emissionFactors.json';
import Link from 'next/link';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

// TODO: send data to backend

export default function Scope2Report() {

  const getEmissionFactor = (country) => emissionFactors[country];
  const [selectedCountry, setSelectedCountry] = useState('');
  const [displayCountries, setDisplayCountries] = useState('No');
  const [inputValid, setInputValid ] = useState(false);
  const user = auth.currentUser;
  const [teamSize, setTeamSize] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [totalDays, setTotalDays] = useState(0);

  const [offices, setOffices] = useState([{ country: '', activityData: '' }]);

  const handleAddOffice = () => {
    setOffices([...offices, { country: '', activityData: '' }]);
  };

  const handleRemoveOffice = (index) => {
    const newOffices = offices.filter((_, i) => i !== index);
    setOffices(newOffices);
  };

  const handleOfficeChange = (index, field, value) => {
    const newOffices = offices.map((office, i) => {
      if (i === index) {
        return { ...office, [field]: value };
      }
      return office;
    });
    setOffices(newOffices);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const checkTeam = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team
    const teamSnap = await getDoc(teamRef);
    

    if (teamSnap.exists()) {
      const newTeamSize = (teamSnap.data().Members.length || 0);
      setTeamSize(newTeamSize);      
      const start = teamSnap.data().CurrentReport.start.toDate();
      const due = teamSnap.data().CurrentReport.due.toDate();
      const total = (due - start ) / (1000 * 60 * 60 * 24); // convert time from ms to days
      setTotalDays(total);
    } else {
      console.log("No such document!");
    }
  };

  const calculate = () => {
    offices.forEach(office => {
      setTotalEmissions(totalEmissions + (emissionFactors[office.country] * office.activityData * totalDays))
    })
    setCalculationComplete(true);
  }

  useEffect(() => {
    const sendToFirestore = async () => {
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      const teamRef = userSnap.data().Team
      const teamSnap = await getDoc(teamRef);

      if (calculationComplete && teamSnap.exists()) {

        const officeBreakdown = offices.reduce((acc, office) => {
          acc[office.country] = (acc[office.country] || 0) + 1;
          return acc;
        }, {});
        
        console.log('this is happening', totalEmissions, officeBreakdown)

        const reportNumber = String(teamSnap.data().CurrentReport.number);
        const reportRef = doc(teamRef, "Reports", reportNumber);
        await updateDoc(reportRef, {
          "Scope 2": {
            "Office Emissions" : totalEmissions,
            "Office Breakdown": officeBreakdown
          }
        });
      }
      // Reset calculationComplete to false after sending data
      setCalculationComplete(false);
    };
  
    if (calculationComplete) {
      sendToFirestore();
    }
  }, [calculationComplete, totalEmissions, offices]);

  useEffect(() => {
    if (user) {
      checkTeam();
    }
  }, [user]);
  
  // This will update the state which allows the user to progress or not
  useEffect(() =>{
    if (displayCountries === "No"){
      setInputValid(true);
    } else {
      setInputValid(true);

      offices.forEach(office => {
        if (office.activityData === "" || office.country === ""){
          setInputValid(false);
        }
      });
    }
  })

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
                Scope 1&rarr;  <span style={{color:'black'}}>Scope 2  </span> &rarr;  Scope 3
              </div>

              <div className={reportStyles.headingText}>Purchased Electricity</div>
                <p>Scope 2 covers indirect emissions from purchased electricity. </p>
                <p>Does your team work in an office with an electricity supply?</p>
                <select 
                  value={displayCountries} 
                  onChange={(e) => setDisplayCountries(e.target.value)}
                  className={reportStyles.inputBoxes}
                  style={{width:'50%'}}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                <div style={{display: displayCountries === "Yes" ? "block" : "none"}}>                
                <p>Please input the location of your office space, along with the electricity used to power the office per day in kWh. If your team are spread internationally, you may add multiple office spaces.</p>

                <div className={reportStyles.dropdownAndInput}>
  
                  {offices.map((office, index) => (
                    <div key={index}>
                      <select 
                        value={office.country} 
                        onChange={(e) => handleOfficeChange(index, 'country', e.target.value)}
                        className={reportStyles.inputBoxes}
                        style={{width: '40%', display: 'inline'}}
                      >
                        <option value="">Location</option>
                        {Object.keys(emissionFactors).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <input
                        value={office.activityData}
                        min="1"
                        onChange={(e) => handleOfficeChange(index, 'activityData', e.target.value)}
                        className={reportStyles.inputBoxes}
                        style={{width: '40%', display: 'inline'}}
                        type="number"
                        placeholder="Electricity usage per day (kWh)"
                      />
                      {offices.length > 1 && (
                        <button onClick={() => handleRemoveOffice(index)} className={reportStyles.removeItem}>
                          &#8722;
                        </button>
                      )}
                    </div>
                  ))}
                  {offices.length < teamSize && (<button onClick={handleAddOffice} className={reportStyles.addItem}>
                    &#43;
                  </button>)}
                  </div>
                </div>

                <Link href="./scope3Report" 
                  className={reportStyles.reportBtn} 
                  onClick={calculate}
                  style={{
                    pointerEvents: inputValid ? 'auto' : 'none',
                    opacity: inputValid ? '1' : '0.5'
                  }}
                  >
                    Continue to scope 3 &rarr;
                </Link>

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

