import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import infoStyles from '../../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import ReportBtn from '../../components/reportBtn';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

export default function SCI() {
  const [ghgView, setGhgView] = useState('Overview');
  const [userType, setUserType] = useState('');
  const [reportDone, setReportDone] = useState(true);
  const user = auth.currentUser;

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
    if (userSnap.data().userType === "lead"){
      if (userSnap.data().progress['GHG'] === true){
        setghgDone(true);
      }
    }
  }


  useEffect(() => {
    getFirestoreData();
  }, []);

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
            <Header title="SCI Score"/>

            <div className={styles.dashboardContent}>
            <div className={styles.dashboardContent}>
              <div className={infoStyles.nav}>
                <button className={infoStyles.navElts} >Overview</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <button className={infoStyles.navElts} >Insights</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <ReportBtn dimension="sci" reportDone={reportDone} style={{pointerEvents: userType === "lead" && reportDone === false ? 'auto' : 'none', opacity: userType === "lead" && reportDone === false ? '1' : '0.5'}} title='Only available for team leads'/>
              </div>


              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw'}}>
                <h1>What is an SCI Score?</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1.5 }}>
                    <p>The Software Carbon Intensity (SCI) score is a metric designed to measure the carbon footprint associated with software applications, developed by the <a href='https://greensoftware.foundation/'>Green Software Foundation</a>. Unlike a GHG report which calculates the <b>total emissions</b>, the SCI calculates the <b>rate of emissions</b>. This score aims to provide a comprehensive overview of the environmental impact of developing, deploying, and running software.</p>
                    <p> By quantifying the carbon emissions per unit of software utility, the SCI score helps organizations and developers make informed decisions to minimize their digital solutions' environmental impact.</p>
                  </div>
                  <div style={{ width: '50%', height: '300px', overflow: 'hidden' }}>
                    <img src="/images/sci.png" alt="SCI score" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <h1>How does it work?</h1>
                  <p>The SCI score is calculated using the formula: SCI = ((E * I) + M) / R, where:</p>
                  <ul>
                  <li>
                    <h1>E = Energy Consumption: </h1>
                    <p>This represents the total amount of energy consumed by the software in kilowatt-hours (kWh). It includes the energy used by servers, databases, networking equipment, and any other infrastructure components required to run the software.</p>
                  </li>
                  <li>
                    <h1>I = Carbon Intensity of Energy: </h1>
                    <p>This factor represents the amount of carbon dioxide (CO2) emitted per kilowatt-hour of energy consumed. It varies based on the energy source (e.g., fossil fuels vs. renewable energy) and geographic location.</p>
                  </li>
                  <li>
                    <h1>M = Embodied Carbon of Hardware: </h1>
                    <p>This accounts for the carbon emissions associated with the production and disposal of hardware used by the software. It includes servers, networking equipment, and end-user devices.</p>
                  </li>
                  <li>
                    <h1>R = Units of Work: </h1>
                    <p>This is a measure of the work performed by the software, such as the number of transactions processed, data analyzed, or users served. It serves as the denominator in the equation, normalizing the carbon emissions based on the utility provided by the software.</p>
                  </li>
                </ul>

                <h1>What do I need to know beforehand?</h1>
                  <p>The components of an SCI are mostly dependant on your specific application, but the main things you will need to know are some detailed energy usage data, knowledge about the carbon intensity of your energyn sources, and data on the embodied emissions from hardware devices you own. </p>
                  <p>It is important for software developers to be aware of these new sustainability practices, so we urge you to do your own research on any aspects of the SCI you are unsure of.</p>
                  <p>You can find more information about the SCI <a href='https://learn.greensoftware.foundation/measurement/'>here!</a></p>
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

