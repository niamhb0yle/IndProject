import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 


export default function Homepage() {
  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{background:'#DBE9FF', minHeight: '100vh', backgroundSize: 'cover'}}>
        <div className={styles.sidebar}></div>    
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

