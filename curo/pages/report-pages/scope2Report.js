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


export default function Scope2Report() {

  const getEmissionFactor = (country) => emissionFactors[country];
  const [selectedCountry, setSelectedCountry] = useState('');
  const [displayCountries, setDisplayCountries] = useState('No');
  const user = auth.currentUser;
  const [teamSize, setTeamSize] = useState(0);
  const [reportDates, setReportDates] = useState({startDate:'', dueDate:''});

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
      const startTimestamp = teamSnap.data().CurrentReport.start;
      const dueTimestamp = teamSnap.data().CurrentReport.due;
      const start = startTimestamp.toDate();
      const due = dueTimestamp.toDate();
      setReportDates({startDate: start.toLocaleDateString(), dueDate: due.toLocaleDateString()})
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (user) {
      checkTeam();
    }
  }, [user]);
  


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

                <p>Does your team work in an office with an electricity supply?</p>
                <select 
                  value={displayCountries} 
                  onChange={(e) => setDisplayCountries(e.target.value)}
                  className={reportStyles.inputBoxes}
                  style={{width:'50%'}}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                {/*
                <div style={{display: displayCountries === "Yes" ? "block" : "none", }}>
                  <p>Please input the location of your office space, along with its corresponding electricity usage from {reportDates.startDate} to {reportDates.dueDate} in kWh (if your team are spread internationally, you may add multiple office spaces)</p>
                  
                  <div style={{height:'fit-content', background:'#ededed', padding:'10px', marginBottom:'30px', borderRadius:'20px'}}>
                    <select 
                      value={selectedCountry} 
                      onChange={handleCountryChange}
                      className={reportStyles.inputBoxes}
                      style={{width:'40%', display:'inline'}}>
                      {Object.keys(emissionFactors).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <input
                      className={reportStyles.inputBoxes}
                      style={{width:'40%', display:'inline'}}
                      type="number"
                      placeholder="Activity data (kWh)"
                    />
                      
                    <button className={reportStyles.addItem}>&#43;</button>

                  </div>



                </div>
                */}
                <p>Please input the location of your office space, along with its corresponding electricity usage from {reportDates.startDate} to {reportDates.dueDate} in kWh. If your team are spread internationally, you may add multiple office spaces.</p>
                <div style={{display: displayCountries === "Yes" ? "block" : "none", height:'fit-content', background:'#ededed', padding:'10px', marginBottom:'30px', borderRadius:'20px'}}>
                  
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
                        onChange={(e) => handleOfficeChange(index, 'activityData', e.target.value)}
                        className={reportStyles.inputBoxes}
                        style={{width: '40%', display: 'inline'}}
                        type="number"
                        placeholder="Activity data (kWh)"
                      />
                      {offices.length > 1 && (
                        <button onClick={() => handleRemoveOffice(index)} className={reportStyles.removeItem}>
                          &#8722;
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={handleAddOffice} className={reportStyles.addItem}>
                    &#43;
                  </button>
                </div>

                <Link href="./scope3Report" 
                className={reportStyles.reportBtn} 
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

