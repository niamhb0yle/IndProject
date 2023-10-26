import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';

export default function signupDev() {
  function handleSubmit(e){
    e.preventDefaullt()
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
          <input style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} type='email'></input>


          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link href='/signupDev2' className={styles.continue}>Continue &rarr;</Link> 
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

