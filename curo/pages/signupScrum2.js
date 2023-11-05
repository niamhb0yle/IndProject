import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
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
          <div id={styles.signupHeader}>Add team members</div>
          <p className={styles.signupInstructions}>Add your squad members by their email addresses and we’ll send them an invite link:</p>

          <div className={styles.inputText}>Email Address</div>
          <input style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} type='email'></input>
          
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

