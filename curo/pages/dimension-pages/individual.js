import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import DashboardNav from '../../components/dashboardNav';

export default function Homepage() {

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{background:'#DBE9FF', backgroundSize: 'cover', marginTop:0, padding:0}}>
        <div className={styles.mainContainer}>
          <SideBar/>

          <div className={styles.dashboard}>
            <DashboardNav/>

            <div className={styles.dashboardContent}>
              <p>Individual page.</p>
              

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

