import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import infoStyles from '../../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import Header from '../../components/Header';
import SideBar from '../../components/sidebar';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { isNotFoundError } from 'next/dist/client/components/not-found';

export default function Reports() {
  const user = auth.currentUser;
  const [userType, setUserType] = useState('');
  const [reportNumber, setReportNumber] = useState('');
  const [dates, setDates] = useState({start:'', due:''})

  const getData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
    const teamRef = userSnap.data().Team;
    const teamSnap = await getDoc(teamRef);
    setReportNumber(String(teamSnap.data().CurrentReport.number));
    const start = teamSnap.data().CurrentReport.start.toDate();
    const due = teamSnap.data().CurrentReport.due.toDate();
    setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
    const reportRef = doc(teamRef, "Reports", reportNumber);
    const reportSnap = await getDoc(reportRef);
    
  }



  useEffect(() => {
    getData();
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
            <Header title="Reports"/>

            <div className={styles.dashboardContent}>

              <div className={infoStyles.reportViewContent}>
                <h1>Current Report</h1>
                <div style={{display:'flex', flex:1, flexDirection:'row'}}>
                  <div style={{display:'flex',flex:0.4, flexDirection:'column' }}>
                    <p>Report number: {reportNumber}</p>
                    <p>Start date: {dates.start}</p>
                    <p>Due: {dates.due}</p>
                  </div>
                  <div style={{display:'flex',flex:0.6 }}>
                  <button style={{
                    pointerEvents: userType === "lead" ? 'auto' : 'none',
                    opacity: userType === "lead" ? '1' : '0.5'
                  }}>Compile report</button>
                  </div>
                </div>
                
              </div>

              <div className={infoStyles.reportViewContent}>
                <h1>Past Reports</h1>
                <div className={infoStyles.pastReportContainer}>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                </div>

                <div className={infoStyles.pastReportContainer}>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
                  <div className={infoStyles.pastReportElt}>
                    Hello
                  </div>
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

