import Link from 'next/link';
import Head from 'next/head';
import infoStyles from '../styles/Info.module.css';
import reportStyles from '../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileExport } from '@fortawesome/free-solid-svg-icons';

export default function PastReport({ onSelectReport, reportNumber }) {
  const [dates, setDates] = useState({start:'', due:''})

  useEffect(() => {
    const getDates = async () =>{
      const user = auth.currentUser;

      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);

      const teamRef = userSnap.data().Team; // Assuming this is directly the team ID
      const reportRef = doc(db, `Teams/${teamRef.id}/Reports/${reportNumber}`);
      const reportSnap = await getDoc(reportRef);

      if (reportSnap.exists()) {
        const start = reportSnap.data().start.toDate();
        const due = reportSnap.data().due.toDate();
        setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
      } else {
        console.log("No such report!");
      }
  }

  getDates();
  }, [])

  return (
    <div>
      <div className={reportStyles.pastReportContainer}>
        <div className={reportStyles.pastReportElt}>
            <p>Report {reportNumber}</p>
        </div>
        <div className={reportStyles.pastReportElt}>
            <p>Finished: {dates.due}</p>
        </div>
        <div className={reportStyles.viewExportBtn}>
            <div onClick={() => onSelectReport(reportNumber)}>View report </div><FontAwesomeIcon icon={faEye} style={{width:'calc(14px + 0.2vw)'}}/>
        </div>
        <div className={reportStyles.viewExportBtn}>
            <>Export report</> <FontAwesomeIcon icon={faFileExport} style={{width:'calc(14px + 0.2vw)'}} />
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

