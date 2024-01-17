import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import { useState, useEffect } from 'react';
import { db, auth } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';




export default function SignUp() {
  const [teamID, setTeamID] = useState('');

  useEffect(() => {
    async function fetchTeamID() {
      const user = auth.currentUser;
      console.log(user.email)
      const coachRef = doc(db, "Users", user.email);
      const coachSnap = await getDoc(coachRef);

      if (coachSnap.exists()) {
        console.log(coachSnap.data().Teams);
        setTeamID(coachSnap.data().Teams[0]);
      } else {
        console.log("No such document!");
      }
    }
    fetchTeamID();
  }, []);
  

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.signupContainer}>

        <div id={styles.signupInputContainer}>
          <div id={styles.signupHeader}>Add team members</div>
          <p className={styles.signupInstructions}>We have created your team! Here is your teams unique identifier: {teamID}. Send this code to your team members so that they can join your Curo group. </p>

          
          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link href='/signupScrum3' className={styles.continue}>Continue &rarr;</Link> 
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

