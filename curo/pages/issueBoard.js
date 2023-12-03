import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";

export default function Homepage() {

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{background:'#DBE9FF', backgroundSize: 'cover', marginTop:0, padding:0}}>
        <div className={styles.mainContainer}>
          <div className={styles.sidebarContainer}>
            <div id={styles.sidebarLogo}>C</div>
            <div className={styles.sidebarNav}>
              <Link id={styles.sidebarNavElements} href='/homepage'>Teams</Link>
              <Link id={styles.sidebarNavElements} href='/homepage'>My issues</Link>
              <Link id={styles.sidebarNavElements} href='/homepage'>Profile</Link>
              <Link id={styles.sidebarNavElements} href='/homepage'>Settings</Link>
            </div>
          </div>

          <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
              <div id={styles.dashboardTitle}>CDAP Squad</div>
              <Link id={styles.teamNavElements} href='/homepage'>Dashboard</Link>
              <Link id={styles.teamNavElements} href='/issueBoard'>Sustainable Goals</Link>
              <Link id={styles.teamNavElements} href='/reports'>Reports</Link>
              <Link id={styles.teamNavElements} href='/teamSettings'>Team Settings</Link>
            </div>

            <div className={styles.dashboardContent}>
                <p>Issue board</p>
            </div>

          </div>
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 2rem 0;
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

