import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import { useState } from 'react';
import { db, auth } from "../firebase";
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';


export default function SignUpScrum() {
  const [teamInfo, setTeamInfo] = useState({teamName:'', org:''});
  const user = auth.currentUser;

  const addTeam = async () => {
    // creating team on firestore
    const docRef = await addDoc(collection(db, "Teams"), {
      name: teamInfo.teamName,
      org: teamInfo.org,
      coach: user.email,
    });

    const coachRef = doc(db, "Leads", user.email);

    // adding link to team on firestore
    await updateDoc(coachRef, {
      Teams: arrayUnion(docRef.id)
    });
  }
  
  
  // Function to set the role and background color
  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  console.log("signup scrum " + auth.currentUser);


  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.signupContainer}>

        <div id={styles.signupInputContainer}>
          <div id={styles.signupHeader}>Create Team</div>
          <p className={styles.signupInstructions}>Create a team to get started...</p>

          <div className={styles.inputText}>Team name</div>
          <input 
            onChange={(e) => setTeamInfo({...teamInfo, teamName:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='email'>
          </input>

          <div className={styles.inputText}>Organisation</div>
          <input 
            onChange={(e) => setTeamInfo({...teamInfo, org:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='text'>
          </input>
          
          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link onClick={addTeam} href='/signupScrum2' className={styles.continue}>Continue &rarr;</Link> 
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

