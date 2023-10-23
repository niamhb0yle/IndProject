import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import "@fontsource/montserrat"; 

export default function Home() {
  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 id={styles.logo}>
          Curo
        </h1>

        <ul className={styles.navbar}>
          <li id={styles.navbarelements}>
            <Link href='/login' id={styles.navbarelements}>Log in</Link>
          </li>
          <li id={styles.navbarelements}>
            <Link href='/signup' id={styles.navbarelements}>Sign up</Link>
          </li>
        </ul>

        
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
