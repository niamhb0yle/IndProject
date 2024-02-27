import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import {useState} from 'react';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router'
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';


export default function NoTeam() {
  const [teamID, setTeamID] = useState('');
  const [teamData, setTeamData] = useState({name: '', org:'', teamLead:'', id: ''});
  const [hideTeam, setHideTeam] = useState(true);
  const [teamFound, setTeamFound] = useState('');
  console.log(teamID);

  const user = auth.currentUser;

  const checkTeam = async () => {
    // checking to find team on firestore
    const teamRef = doc(db, "Teams", teamID);
    const teamSnap = await getDoc(teamRef);

    if (teamSnap.exists() && teamID!="") {
      setTeamData({name: teamSnap.data().name, org: teamSnap.data().org, teamLead: teamSnap.data().coach, id: teamID});
      console.log(teamData);
      setHideTeam(false);
      setTeamFound('Yes');
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setTeamFound('No');
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

      <main className={styles.container}>
        <div className={styles.noTeamContainer} style={{ width:'40vw'}}>
          <div className={styles.noTeamHeader} >No team found...</div>

          <p className={styles.signupInstructions} >It seems your account is not linked to any team in our system.</p>
          <p className={styles.signupInstructions} >No worries! Join a new team by entering its unique key here:</p>

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

          <p className={styles.inputText} style={{display: teamFound=='No' ? 'block' : 'none'}}>We couldn't find a team with that ID. Please check with your team lead that you have the right code.</p>

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

