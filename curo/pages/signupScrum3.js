import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
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
          <div id={styles.signupHeader}>Welcome!</div>
          <p className={styles.signupInstructions}>Congrats! Your team and account has been created. Click continue to visit your homepage, where you can get started.</p>

          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link href='/homepage' className={styles.continue}>Continue to homepage &rarr;</Link> 
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

