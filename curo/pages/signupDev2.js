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
          <div id={styles.signupHeader}>Sit tight...</div>

          <p className={styles.signupInstructions}>Thank you for registering! We've notified your scrum master, when they verify your identity you will be added to the team, which will appear in your dashboard.</p>

          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link href='/homepage' className={styles.continue}>Continue to Dashboard &rarr;</Link> 
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

