import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import { useState } from 'react';
import { db, auth } from "../firebase";


export default function SignUpScrum() {
  const [teamInfo, setTeamInfo] = useState({teamName:'', org:''})

  // creating team on firestore
  setDoc(doc(db, fieldName, user.uid), {
    email: userProfile.email,
    username: userProfile.username,
  });
  
  
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
          <p className={styles.signupInstructions}>Create your team in just a few clicks...</p>

          <div className={styles.inputText}>Team name</div>
          <input 
            onChange={(e) => setUserProfile({...teamInfo, teamName:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='email'>
          </input>

          <div className={styles.inputText}>Organisation</div>
          <input 
            onChange={(e) => setUserProfile({...teamInfo, org:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='text'>
          </input>
          
          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link href='/signupScrum2' className={styles.continue}>Continue &rarr;</Link> 
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

