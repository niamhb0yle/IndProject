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
import { collection, addDoc, doc, updateDoc, setDoc, getDoc, query, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { isNotFoundError } from 'next/dist/client/components/not-found';
import PastReport from '../../components/pastReport';
import CurrentReport from '../../components/currentReport';
import ViewReport from '../../components/viewReport';

export default function Reports() {
  const user = auth.currentUser;
  const [reportView, setReportView] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [docCount, setDocCount] = useState(0);

  const handleReportSelect = (selectedReport) => {
    setSelectedReport(selectedReport);
    setReportView(true);
  }

  const handleCloseReport = () => {
    setReportView(false);
  }

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return; // Ensure the user is defined
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return; // Ensure user data exists
      const teamRef = userSnap.data().Team;
      const reportsCollectionRef = collection(db, `Teams/${teamRef.id}/Reports`);
      const querySnapshot = await getDocs(reportsCollectionRef);
      setDocCount(querySnapshot.docs.length);
      console.log(querySnapshot)
    };
  
    fetchReports();
    console.log(docCount)
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
            <Header title="Reports"/>

            <div className={styles.dashboardContent}>

              <div style={{display: reportView ? "none": "block"}}>
                <CurrentReport/>
              </div>

              <div className={infoStyles.reportViewContent} style={{display: reportView ? "none": "block"}}>
                <h1>Past Reports</h1>
                <div>
                  {Array.from({ length: docCount - 1 }, (_, index) => (
                    <PastReport
                      key={index}
                      onSelectReport={() => handleReportSelect(index+1)}
                      reportNumber={String(index + 1)}
                    />
                  ))}
                </div>
              </div>

              <div style={{display: reportView ? "block": "none"}}>
                <ViewReport reportNumber={selectedReport} onCloseReport={handleCloseReport}/>
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

