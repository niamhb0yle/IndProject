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

export default function Ecconomic() {
  const user = auth.currentUser;
  const [view, setView] = useState('Overview');
  const [reportDone, setReportDone] = useState(false);
  

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.data().progress['Economic'] === true){
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
            <Header title="Economic"/>

            <div className={styles.dashboardContent}>
              <div className={infoStyles.nav}>
                <button className={infoStyles.navElts} onClick={() => setView("Overview")} style={{color: view === "Overview" ? "#354cfc" : "black"}}>Overview</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <button className={infoStyles.navElts} onClick={() => setView("Insights")} style={{color: view === "Insights" ? "#354cfc" : "black"}} >Insights</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <ReportBtn dimension="economic" reportDone={reportDone}/>
              </div>


              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw', display: view ==="Overview" ? 'block' : 'none'}}>
                <h1>What is Economic sustainability?</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1.5 }}>
                    <p>Economic sustainability in software development ensures that projects are financially viable, contribute to sustained economic growth, and maintain a competitive edge in the industry. It focuses on creating value that extends beyond immediate profits, emphasizing long-term financial health, innovation, and the economic well-being of all stakeholders involved. </p>
                    <p>This dimension encompasses a broad spectrum of financial aspects, including capital growth, effective budget management, and the strategic allocation of resources. It advocates for practices that ensure the software not only meets current market demands but also adapts to future economic landscapes.</p>
                  </div>
                  <div style={{ width: '50%', height: '300px', overflow: 'hidden' }}>
                    <img src="/images/economic.png" alt="Economic Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <h1>Why should we care?</h1>
                  <p>Economic sustainability is crucial for the resilience and success of software projects. By emphasizing economic considerations, developers can ensure their projects are not just viable products but also sustainable investments. This approach helps attract and retain talent, secure funding, and foster a culture of innovation.</p>
                  <p>Moreover, economically sustainable practices contribute to the broader economic ecosystem by supporting job security, offering personal advancement opportunities, and driving industry competitiveness. They ensure that the software industry remains a dynamic and thriving sector, capable of adapting to and shaping future technological and economic trends.</p>
                
                <h1>What are some key areas to consider?</h1>
                  <p>Here are the key areas you can focus on to improve technical sustainability in your application:</p>
                <ul>
                  <li>
                    <h1>Reducing technical debt: </h1>
                    <p>Reducing technical debt is crucial for ensuring long-term project viability and reducing future costs associated with maintenance and updates</p>
                  </li>
                  <li>
                    <h1>Job Security and Personal Advancement: </h1>
                    <p>Create opportunities for team members to grow professionally and advance their careers within the project or organization</p>
                  </li>
                  <li>
                    <h1>Working effectively to the project budget: </h1>
                    <p>Develop and implement strategies for managing project budgets effectively</p>
                  </li>
                  <li>
                    <h1>Innovation and Industry Competitiveness: </h1>
                    <p>Ensure that your application brings something innovative to an already competitive landscape, and increases industry competitiveness</p>
                  </li>
                </ul>
              </div>

              <div style={{display: view === "Insights" ? 'block': 'none'}}>
                <DimensionInsights dimension="Economic"/>
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

