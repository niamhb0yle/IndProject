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
import { auth, db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionInsights from '../../components/DimensionInsights';

export default function Environmental() {
  const user = auth.currentUser;
  const [view, setView] = useState('Overview');
  const [reportDone, setReportDone] = useState(false);
  

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.data().progress['Environmental'] === true){
      setReportDone(true);
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
            <Header title="Environmental"/>

            <div className={styles.dashboardContent}>
              <div className={infoStyles.nav}>
                <button className={infoStyles.navElts} onClick={() => setView("Overview")} style={{color: view === "Overview" ? "#354cfc" : "black"}}>Overview</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <button className={infoStyles.navElts} onClick={() => setView("Insights")} style={{color: view === "Insights" ? "#354cfc" : "black"}} >Insights</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <ReportBtn dimension="environmental" reportDone={reportDone}/>
              </div>


              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw', display: view ==="Overview" ? 'block' : 'none'}}>
                <h1>What is Environmental sustainability?</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1.5 }}>
                    <p>Environmental sustainability in software development concerns minimizing the environmental impact of software throughout its lifecycle. It involves thoughtful use and stewardship of natural resources, from reducing immediate waste production and energy consumption to considering the long-term effects on local ecosystems and the global climate.</p>
                    <p>This dimension encourages developers to consider the environmental footprint of their software, including the energy efficiency of data centers, the materials used in hardware, and the overall carbon footprint of operating software systems.</p>
                  </div>
                  <div style={{ width: '50%', height: '300px', overflow: 'hidden' }}>
                    <img src='/images/environmental.png' alt="Environmental Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <h1>Why should we care?</h1>
                  <p>Environmental sustainability is increasingly critical in the context of global climate change and environmental degradation. For software developers, focusing on this dimension means contributing to the reduction of the tech industry's environmental impact, fostering responsible use of resources, and promoting sustainability practices among users and stakeholders.</p>
                  <p>By developing energy-efficient software, minimizing resource consumption, and using eco-friendly development practices, developers can reduce the environmental footprint of their projects, save costs, and meet the growing demand from consumers, businesses, and governments for green technology solutions.</p>
                
                <h1>What are some key areas to consider?</h1>
                  <p>Here are the key areas you can focus on to improve environmental sustainability in your application:</p>
                <ul>
                  <li>
                    <h1>Energy Efficiency: </h1>
                    <p>Optimize software for energy efficiency to reduce the energy consumption of servers and devices</p>
                  </li>
                  <li>
                    <h1>Lifecycle Management & Waste: </h1>
                    <p>Consider the entire lifecycle of software, from development to disposal. Ensure that any hardware being disposed is done so in an environmentally responsible manner</p>
                  </li>
                  <li>
                    <h1>Awareness and Advocacy: </h1>
                    <p>Team members should be aware of environmental issues regarding software development</p>
                  </li>
                  <li>
                    <h1>Clean Energy: </h1>
                    <p>Make use of renewable energy where possible! Adopt green technologies into your teams tech stack</p>
                  </li>
                </ul>
              </div>

              <div style={{display: view === "Insights" ? "block" : "none"}}>
                <DimensionInsights dimension="Environmental"/>
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

