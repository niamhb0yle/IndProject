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

export default function Scope1Report() {

  const [vehicles, setVehicles] = useState([{ avgMiles: 0, avgEmissionFactor: 0 }]);
  const [generatorData, setGeneratorData] = useState({ fuelConsumed: 0, emissionFactor: 0 });
  const [teamTransports, setTeamTransports] = useState([{ transportMode: "" }]);

  const emissionFactors = {
    "Diesel Car": 0.27492,
    "Petrol Car": 0.27436,
    "HybridCar": 0.19318,
    "Plug-in Hybrid Car": 0.11007,
    "Motorcycle": 0.18274,
    "Works from home": 0,
    "Public Transport": 0,
    "Bike": 0,
  };

  const handleVehicleChange = (index, e) => {
    const newVehicles = [...vehicles];
    newVehicles[index][e.target.name] = e.target.value;
    setVehicles(newVehicles);
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { avgMiles: 0, avgEmissionFactor: 0 }]);
  };

  const handleGeneratorDataChange = (e) => {
    setGeneratorData({ ...generatorData, [e.target.name]: e.target.value });
  };

  const handleTransportChange = (index, e) => {
    const newTransports = [...teamTransports];
    newTransports[index].transportMode = e.target.value;
    setTeamTransports(newTransports);
  };

  const addTransport = () => {
    setTeamTransports([...teamTransports, { transportMode: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculation and submission logic goes here
    console.log('Vehicles:', vehicles);
    console.log('Generator Data:', generatorData);
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
        {/* ... existing form elements for vehicles and generators ... */}
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
        <button type="button" onClick={addTransport}>Add Another Transport Mode</button>
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

