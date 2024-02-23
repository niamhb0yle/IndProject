import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import infoStyles from '../../styles/Info.module.css';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';

export default function Homepage() {
  const [teamInfo, setTeamInfo] = useState({name:'', lead:'', org:'', key:'', members:[], currentReport:{}});

  useEffect(() => {
    const setTeamData = async () => {
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      const teamRef = userSnap.data().Team;
      const teamSnap = await getDoc(teamRef);
      setTeamInfo({
        name: teamSnap.data().name,
        org: teamSnap.data().org,
        lead: teamSnap.data().coach,
        members: teamSnap.data().Members || [],
        currentReport: teamSnap.data().CurrentReport,
        key: teamSnap.id,
      })
    }
    setTeamData();
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
            <Header title="Team Settings"/>

            <div className={styles.dashboardContent}>

              <div className={infoStyles.reportViewContent} >
                <h1>Team info</h1>
                <p>Team name: {teamInfo.name}</p>
                <p>Organisation: {teamInfo.org}</p>
                <p>Team Lead: {teamInfo.lead}</p>
                <p>Special key: {teamInfo.key}</p>
                
              </div>

              <div className={infoStyles.reportViewContent} >
                <h1>Members</h1>
                {
                  teamInfo.members.map((member, index) => (
                    <p key={index}>{member}</p>
                  ))
                }
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

