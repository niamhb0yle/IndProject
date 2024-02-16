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
import PastReport from '../../components/pastReport';
import CurrentReport from '../../components/currentReport';

export default function Reports() {
  const user = auth.currentUser;
  const [userType, setUserType] = useState('');
  const [reportNumber, setReportNumber] = useState('');
  const [dates, setDates] = useState({start:'', due:''});
  const [progress, setProgress] = useState('Complete');

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

              <CurrentReport/>

              <div className={infoStyles.reportViewContent}>
                <h1>Past Reports</h1>
                <PastReport/>
                <PastReport/>
                <PastReport/>
                
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

