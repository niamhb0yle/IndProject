import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import Button from '../components/button.js'


export default function SignUp() {

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.signupContainer}>

        <div id={styles.signupInputContainer}>
          <div id={styles.signupHeader}>Create Account</div>

          <div className={styles.signupInputText}>Email Address</div>
          <div style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5}}></div>
          <div className={styles.signupInputText}>Display Name</div>
          <div style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5}}></div>
          <div className={styles.signupInputText}>Password</div>
          <div style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5}}></div>
     
          <p className={styles.signupInstructions}>Please select your role: </p>
          <Button text='Developer'></Button>
          <Button text='Scrum Master'></Button>
          <Button text='Product Owner'></Button>

          <div className={styles.continue}>Continue &rarr;</div>
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

