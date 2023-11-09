import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../firebase";

export default function SignUpDev() {
  const [teamID, setTeamID] = useState('');
  const [teamData, setTeamData] = useState({name: '', org:'', teamLead:''});
  const [hideTeam, setHideTeam] = useState(true);
  console.log(teamID);

  function handleSubmit(e){
    e.preventDefaullt()
  }

  const checkTeam = async () => {
    // checking to find team on firestore
    const teamRef = doc(db, "Teams", teamID);
    const teamSnap = await getDoc(teamRef);

    if (teamSnap.exists() && teamID!="") {
      setTeamData({name: teamSnap.data().name, org: teamSnap.data().org, teamLead: teamSnap.data().coach});
      console.log(teamData);
      setHideTeam(false);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
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

          <p className={styles.signupInstructions}>Join your squad by entering their unique ID - we’ll then ask your scrum member to verify: </p>

          <div className={styles.inputText}>Team ID</div>
          <input style={{width: '75%', height: 48, display:'inline-block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            onClick={
              (e) => setTeamID(e.target.value)
            }
            type='email'>
          </input>

          <button className={styles.checkTeamButton} onClick={checkTeam}>Check</button>
          <p className={styles.inputText} hidden={hideTeam}>Does this look right?</p>
          <ul hidden={hideTeam}>
            <li className={styles.inputText}>Name: {teamData.name}</li>
            <li className={styles.inputText}>Organisation: {teamData.org}</li>
            <li className={styles.inputText}>Coach: {teamData.teamLead}</li>
          </ul>
          <p className={styles.inputText} hidden={hideTeam}>If not, check with your team lead that you have the right code.</p>


          <div style={{textAlign: 'right', marginTop:'50px'}} hidden={hideTeam}>
            <Link href='/signupDev2' onClick={checkTeam} className={styles.continue}>This looks right &rarr;</Link> 
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

