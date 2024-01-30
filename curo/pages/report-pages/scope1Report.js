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


// TODO: Styling for form, add in heating/utility usage part later

export default function Scope1Report() {
  const teamSize = 4; // TODO: add firebase fetch code here
  const initialTeamTransports = Array.from({ length: teamSize }, () => ({ transportMode: "" }));
  const [teamTransports, setTeamTransports] = useState(initialTeamTransports);

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


  const handleTransportChange = (index, e) => {
    const newTransports = [...teamTransports];
    newTransports[index].transportMode = e.target.value;
    setTeamTransports(newTransports);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: add calculations
    console.log('Team Transports:', teamTransports);
  };

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
            <div className={reportStyles.reportContainer}>
              <form onSubmit={handleSubmit}>
                <h2>Team's Mode of Transport</h2>
                  {teamTransports.map((transport, index) => (
                    <div key={index}>
                      <label>Team Member {index + 1}'s Transport Mode: </label>
                      <select
                        value={transport.transportMode}
                        onChange={(e) => handleTransportChange(index, e)}
                      >
                        <option value="">Select Transport Mode</option>
                        {Object.keys(emissionFactors).map((mode) => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                <button type="submit">Submit Data</button>
            </form>
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

