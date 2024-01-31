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



// TODO: Styling for form, add in heating/utility usage part later

export default function Scope1Report() {
  const user = auth.currentUser;
  const [teamSize, setTeamSize] = useState(0); // TODO: add firebase fetch code here
  const [reportDates, setReportDates] = useState({startDate:'', dueDate:''});
  const initialTeamTransports = Array.from({ length: teamSize }, () => ({ transportMode: "", milesTravelled:0 }));
  const [teamTransports, setTeamTransports] = useState(initialTeamTransports);
  const carTransportModes = ["Diesel Car", "Petrol Car", "Hybrid Car", "Plug-in Hybrid Car", "Motorcycle"];

  const emissionFactors = {
    "Diesel Car": 0.27492,
    "Petrol Car": 0.27436,
    "Hybrid Car": 0.19318,
    "Plug-in Hybrid Car": 0.11007,
    "Motorcycle": 0.18274,
    "Works from home": 0,
    "Public Transport": 0,
    "Bike": 0,
  };

  const checkTeam = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team
    const teamSnap = await getDoc(teamRef);
    

    if (teamSnap.exists()) {
      const newTeamSize = (teamSnap.data().Members.length || 0);
      setTeamSize(newTeamSize);
      setTeamTransports(Array.from({ length: newTeamSize }, () => ({ transportMode: "" })));
      
      const startTimestamp = teamSnap.data().CurrentReport.start;
      const dueTimestamp = teamSnap.data().CurrentReport.due;
      const start = startTimestamp.toDate();
      const due = dueTimestamp.toDate();
      setReportDates({startDate: start.toLocaleDateString(), dueDate: due.toLocaleDateString()})
    } else {
      console.log("No such document!");
    }
  };

  const handleTransportChange = (index, e) => {
    const newTransports = [...teamTransports];
    newTransports[index].transportMode = e.target.value;
    setTeamTransports(newTransports);
  };

  const handleMilesChange = (index, e) => {
    const newTransports = [...teamTransports];
    newTransports[index].milesTravelled = e.target.value;
    setTeamTransports(newTransports);
};

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: add calculations
    console.log('Team Transports:', teamTransports);
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
          <Header title="Scope 1"/>
          
          <div className={styles.dashboardContent}>
            <div className={reportStyles.reportContainer} style={{width:'100%'}}>
            
            
              <div className={reportStyles.headingText2}>Team's Mode of Transport</div>
                <p style={{color:'black'}}>For this section, we will make an estimate on the teams carbon emissions from travelling to work. Please enter each members <b>primary</b> mode of transport, as well as an estimate of the miles travelled using this mode of transport, between the dates {reportDates.startDate} and {reportDates.dueDate}.</p>

                <div className={reportStyles.teamEntriesContainer}>
                {teamTransports.map((transport, index) => (
                  <div className={reportStyles.teamEntries} key={index}>
                    <h1>Team Member {index + 1}:</h1>
                    <p>Mode of transport</p>
                    <select
                      value={transport.transportMode}
                      onChange={(e) => handleTransportChange(index, e)}
                      className={reportStyles.inputBoxes}
                      style={{width:'300px'}}
                    >
                      <option value="">Select Transport Mode</option>
                      {Object.keys(emissionFactors).map((mode) => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>

                    {carTransportModes.includes(transport.transportMode) && (
                      <>
                        <p>Estimate of miles travelled</p>
                        <input
                          className={reportStyles.inputBoxes}
                          style={{width:'200px'}}
                          type="number"
                          value={transport.milesTravelled}
                          onChange={(e) => handleMilesChange(index, e)}
                          placeholder="Miles"
                        />
                      </>
                    )}
                  </div>
                ))}

                </div>

              <div>
                <div className={reportStyles.headingText2}>On site Energy Consumption</div>

              </div>
            <button onClick={handleSubmit}>Submit Data</button>
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

