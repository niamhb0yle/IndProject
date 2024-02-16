import Link from 'next/link';
import Head from 'next/head';
import infoStyles from '../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function CurrentReport() {
  const user = auth.currentUser;
  const [userType, setUserType] = useState('');
  const [reportNumber, setReportNumber] = useState('');
  const [dates, setDates] = useState({start:'', due:''});
  const [progress, setProgress] = useState('Complete');
  const [incompleteMembers, setIncompleteMembers] = useState([]);

  const getData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
    const teamRef = userSnap.data().Team;
    const teamSnap = await getDoc(teamRef);
    const start = teamSnap.data().CurrentReport.start.toDate();
    const due = teamSnap.data().CurrentReport.due.toDate();
    setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
    const reportNumberLocal = String(teamSnap.data().CurrentReport.number);
    const reportRef = doc(db, `Teams/${teamSnap.id}/Reports/${reportNumberLocal}`);
    setReportNumber(reportNumberLocal);
    const reportSnap = await getDoc(reportRef);
    setIncompleteMembers([]);
  
    const members = teamSnap.data().Members || [];

    // using Promise.all to wait for all member data to be fetched
    const memberProgresses = await Promise.all(members.map(async (member) => {
      const memberRef = doc(db, "Users", member);
      const memberSnap = await getDoc(memberRef);
      let tempComplete = true;
      const memberProgress = memberSnap.data().progress;
      Object.keys(memberProgress).forEach((key) => {
        if (memberProgress[key] === false) {
          tempComplete = false;
        }
      });
      return { member, tempComplete };
    }));
  
    memberProgresses.forEach((member) => {
      if (!member.tempComplete) {
        setProgress('Incomplete');
        setIncompleteMembers((prevMembers) => [...prevMembers, member.member]);
      }
    });

  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className={infoStyles.reportViewContent}>
        <h1>Current Report</h1>
        <div style={{display:'flex', flex:1, flexDirection:'row'}}>
          
          <div style={{display:'flex', minWidth:'fit-content', flex:0.3, flexDirection:'column', marginRight:'2vw'}}>
            <p>Report number: {reportNumber}</p>
            <p>Start date: {dates.start}</p>
            <p>Due: {dates.due}</p>
          </div>

          <div style={{display:'flex', minWidth:'fit-content', flex:0.3, flexDirection:'column', marginRight:'2vw'}}>
              <p>Report progress: {progress}</p>
              {incompleteMembers.length > 0 ? (
                <div>
                  <p>Members still to complete their reports:</p>
                  <div  style={{marginLeft:'1vw'}}>
                  {incompleteMembers.map((member, index) => (
                    <div key={index}>{member}</div>
                  ))}
                  </div>
                </div>
              ) : (
                <div>All members have completed their reports!</div>
              )}
          </div>

          <div style={{display:'flex', minWidth:'fit-content', flex:0.33,  marginRight:'2vw'}}>
            <button className={infoStyles.reportPageBtn}
              style={{
              pointerEvents: userType === "lead" && progress === "Complete" ? 'auto' : 'none',
              opacity: userType === "lead" && progress === "Complete" ? '1' : '0.5',
              display:'block'
            }}>Finish report</button>
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

