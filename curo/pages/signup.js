import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import Button from '../components/button.js'
import signupImage from '../public/images/developer.png'
import { useState } from 'react';


export default function SignUp() {
  const [role, setRole] = useState('');
  const [continueDisabled, setContinueDisabled] = useState(true);
  
  // Function to set the role and background color
  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  function validate(){
    if (role==''){
      return 'invalid'
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
          <div id={styles.signupHeader}>Create Account</div>

          <div className={styles.inputText}>Email Address</div>
          <input style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} type='email'></input>
          <div className={styles.inputText}>Display Name</div>
          <input style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} type='text'></input>
          <div className={styles.inputText}>Password</div>
          <input style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} type='password'></input>
     
          <p className={styles.signupInstructions}>Please select your role: </p>

          <button
            text="Developer"
            className={styles.signupButton}
            onClick={() => handleRoleClick('dev')}
            style={{ background: role === 'dev' ? '#CEDCFA' : '#DBE9FF' }}
          >Developer</button>
          <button
            text="Scrum Master"
            className={styles.signupButton}
            onClick={() => handleRoleClick('sm')}
            style={{ background: role === 'sm' ? '#CEDCFA' : '#DBE9FF' }}
          >Scrum Master</button>
          <button
            text="Product Owner"
            className={styles.signupButton}
            onClick={() => handleRoleClick('po')}
            style={{ background: role === 'po' ? '#CEDCFA' : '#DBE9FF' }}
          >Product Owner</button>

          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link href={role === 'dev' ? '/signupDev' : '/signupScrum'} className={styles.continue} aria-disabled={continueDisabled}>Continue &rarr;</Link> 
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

