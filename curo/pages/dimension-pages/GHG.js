import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import reportStyles from '../../styles/Reports.module.css';
import infoStyles from '../../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import ReportBtn from '../../components/reportBtn';
import GHGOverview from '../../components/ghgOverview';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import TeamGHGStats from '../../components/TeamGHGStats';
import GHGStats from '../../components/ghgStats';

export default function GHG() {
  const [ghgView, setGhgView] = useState('Overview');
  const [userType, setUserType] = useState('');
  const [ghgDone, setghgDone] = useState(false);
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
            <Header title="GHG Protocol"/>

            <div className={infoStyles.nav}>
              <button className={infoStyles.navElts} onClick={() => setGhgView("Overview")} style={{color: ghgView === "Overview" ? "#354cfc" : "black"}}>Overview</button>
              <p className={infoStyles.navEltsBar}>|</p>
              <button className={infoStyles.navElts} onClick={() => setGhgView("Team Stats")} style={{color: ghgView === "Team Stats" ? "#354cfc" : "black"}}>Team Stats</button>
              <p className={infoStyles.navEltsBar}>|</p>
              <button className={infoStyles.navElts} onClick={() => setGhgView("GHG Stats")} style={{color: ghgView === "GHG Stats" ? "#354cfc" : "black"}}>GHG Stats</button>
              <p className={infoStyles.navEltsBar}>|</p>
              <Link href='../report-pages/scope1Report' className={infoStyles.navElts} style={{pointerEvents: userType === "lead" && ghgDone ? 'auto' : 'none', opacity: userType === "lead" && ghgDone ? '1' : '0.5'}} title='Only available for team leads'>Start Report &rarr;</Link>  
            </div>

            <div style={{display: ghgView === "Overview" ? "block" : "none"}}>
              <GHGOverview/>
            </div>

            <div style={{display: ghgView === "Team Stats" ? "block" : "none"}}>
              <TeamGHGStats/>
            </div>
            
            <div style={{display: ghgView === "GHG Stats" ? "block" : "none"}}>
              <GHGStats/>
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

