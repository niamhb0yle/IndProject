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
import Link from 'next/link';

// TODO: send to backend

export default function Scope1Report() {
  const user = auth.currentUser;
  const [teamSize, setTeamSize] = useState(0);
  const [reportDates, setReportDates] = useState({startDate:'', dueDate:''});
  const initialTeamTransports = Array.from({ length: teamSize }, () => ({ transportMode: "", milesTravelled:0 }));
  const [teamTransports, setTeamTransports] = useState(initialTeamTransports);
  const [powerType, setPowerType] = useState('Gas');
  const [kwh_per_day, set_kwh] = useState(0);
  const [displayGenerators, setDisplayGenerators] = useState('No');
  const carTransportModes = ["Diesel Car", "Petrol Car", "Hybrid Car", "Plug-in Hybrid Car", "Motorcycle"];
  const [transportEmissions, setTransportEmissions] = useState();
  const [generatorEmissions, setGeneratorEmissions] = useState();
  const [totalHours, setTotalHours] = useState(0);

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

  const generatorEmissionFactors = {
    "Coal": 0.82,
    "Gas": 0.49,
    "Solar Powered":0.041,
    "Biomass":0.23
  }

  function calculate() {
    // Calculate team transports
    let teamTotal = 0;

    teamTransports.forEach(transport =>{
      if (transport.transportMode && transport.milesTravelled) {
        // Get the emission factor for the selected transport mode
        const emissionFactor = emissionFactors[transport.transportMode];
        // Calculate the emissions for this team member and add it to the total
        teamTotal += emissionFactor * transport.milesTravelled;
      }
    });
    
    console.log(teamTotal)

    // Check to make sure the team has a generator - if not, do not include in report
    if (displayGenerators==="Yes"){
      // activity * emission factor = total emissions
      setGeneratorEmissions(((kwh_per_day * generatorEmissionFactors[powerType]) * (totalHours/24))  );
      console.log("Generator emissions: ", generatorEmissions)
    }
  }

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
      const differenceInMilliseconds = Math.abs(startTimestamp - dueTimestamp);
      setTotalHours(differenceInMilliseconds / 3600000);
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
            <div className={reportStyles.reportContainer} style={{width:'100%'}}>

            <div className={reportStyles.scopeHeadingText}>
              <span style={{color:'black'}}>Scope 1</span> &rarr;  Scope 2  &rarr;  Scope 3
            </div>
            
            
              <div className={reportStyles.headingText2}>Team's Mode of Transport</div>
                <p style={{color:'black'}}>For this section, we will make an estimate on the teams carbon emissions from travelling to work. Please enter each members <b>primary</b> mode of transport, as well as an estimate of the miles travelled using this mode of transport, between the dates <b>{reportDates.startDate}</b> and <b>{reportDates.dueDate}</b>.</p>

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
                <div className={reportStyles.headingText2}>On site Generators</div>
                <p style={{color:'black'}}>Emissions from generators used owned and used directly by your team/company count towards scope 1 emissions.</p>
                <p style={{color:'black'}}> Does your team own/use a generator?</p>
                <select 
                  value={displayGenerators} 
                  onChange={(e) => setDisplayGenerators(e.target.value)}
                  className={reportStyles.inputBoxes}
                  style={{width:'20%', display:'inline'}}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                <div style={{display: displayGenerators === "Yes" ? "block" : "none"}}>
                    <p>Please select the type of generator your team use, an estimate for how much electricity is generated per day in kWh, and how many days a week the generator is on:</p>
                    
                    <div className={reportStyles.dropdownAndInput} style={{width:'75%'}}>
                      <div style={{display:'block', padding:'10px'}}>
                        <p style={{width:'40%', display:'inline-block', margin:'5px', color:'black', fontWeight:'bold'}}>Generator Type:</p>
                        <p style={{width:'40%', display:'inline-block', margin:'5px', color:'black', fontWeight:'bold'}}>Activity per Day</p>
                      </div>
                      <select 
                        value={powerType} 
                        onChange={(e) => setPowerType(e.target.value)}
                        className={reportStyles.inputBoxes}
                        style={{width: '40%', display: 'inline'}}
                      >
                        {Object.keys(generatorEmissionFactors).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        value={kwh_per_day}
                        onChange={(e) => set_kwh(e.target.value)}
                        className={reportStyles.inputBoxes}
                        style={{width: '40%', display: 'inline'}}
                        type="number"
                        placeholder="Activity per day (kWh)"
                      />
                    </div>
                </div>

              </div>

              <button onClick={calculate}>Calculate</button>

              <Link href="./scope2Report" 
              className={reportStyles.reportBtn} 
              >
                Continue to scope 2 &rarr;
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

