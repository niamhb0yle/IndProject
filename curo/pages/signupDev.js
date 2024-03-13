import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState } from 'react';
import { doc, getDoc, arrayUnion, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from "../firebase";

export default function SignUpDev() {
  const [teamID, setTeamID] = useState('');
  const [teamData, setTeamData] = useState({name: '', org:'', teamLead:'', id: ''});
  const [hideTeam, setHideTeam] = useState(true);
  console.log(teamID);

  const user = auth.currentUser;

  const checkTeam = async () => {
    // checking to find team on firestore
    const teamRef = doc(db, "Teams", teamID);
    const teamSnap = await getDoc(teamRef);
    const currentReportNumber = teamSnap.data().CurrentReport.number
    const userRef = doc(db, "Users", user.email);

    // create a subcollection named 'Reports' for first report
    const reportRef = doc(userRef, 'Reports', currentReportNumber.toString());
    await setDoc(reportRef, {});

    if (teamSnap.exists() && teamID!="") {
      setTeamData({name: teamSnap.data().name, org: teamSnap.data().org, teamLead: teamSnap.data().coach, id: teamID});
      console.log(teamData);
      setHideTeam(false);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  const addMember = async () => {
    const teamRef = doc(db, "Teams", teamID);

    // adding link to team on firestore
    await updateDoc(teamRef, {
      Members: arrayUnion(user.email)
    });

    const userRef = doc(db, "Users", user.email);
    await updateDoc(userRef, {
      Team: teamRef,
      userType:'dev'
    });

  }

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.signupContainer}>
      <div id={styles.signupInputContainer}>
          <div id={styles.signupHeader}>Join a Team</div>

          <p className={styles.signupInstructions}>Join your squad by entering their unique ID - we’ll then ask your scrum master to verify: </p>

          <div className={styles.inputText}>Team ID</div>
          <input style={{width: '75%', height: 48, display:'inline-block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            onChange={
              (event) => setTeamID(event.target.value)
            }
            type='email'>
          </input>

          <button className={styles.checkTeamButton} onClick={checkTeam} style={{
            pointerEvents: teamID=='' ? 'none' : 'auto',
            opacity: teamID=='' ? '0.5' : '1',
          }}>Check</button>
          <p className={styles.inputText} hidden={hideTeam}>Does this look right?</p>
          <ul hidden={hideTeam}>
            <li className={styles.inputText}>Name: {teamData.name}</li>
            <li className={styles.inputText}>Organisation: {teamData.org}</li>
            <li className={styles.inputText}>Coach: {teamData.teamLead}</li>
          </ul>
          <p className={styles.inputText} hidden={hideTeam}>If not, check with your team lead that you have the right code.</p>


          <div style={{textAlign: 'right', marginTop:'50px'}} hidden={hideTeam}>
            <Link href='/signupDev2' onClick={addMember} className={styles.continue}>This looks right &rarr;</Link> 
          </div>
        </div>     
        
      </main>

      <style jsx>{`
        main {
          padding: 2rem 0;
          display: block;
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

