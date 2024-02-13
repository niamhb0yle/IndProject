import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import reportStyles from '../../styles/Reports.module.css';
import infoStyles from '../../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import ReportBtn from '../../components/reportBtn';
import GHGOverview from '../../components/ghgOverview';
import { useState } from 'react';
import GHGStats from '../../components/ghgStats';

export default function GHG() {
  const [ghgView, setGhgView] = useState('Overview');

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.mainContainer}>
          <SideBar/>

          <div className={styles.dashboard}>
            <Header title="GHG Protocol"/>

            <div className={infoStyles.nav}>
              <button className={infoStyles.navElts} onClick={() => setGhgView("Overview")}>Overview</button>
              <p className={infoStyles.navEltsBar}>|</p>
              <button className={infoStyles.navElts} onClick={() => setGhgView("Stats")}>Team Stats</button>
              <p className={infoStyles.navEltsBar}>|</p>
              <Link href='../report-pages/scope1Report' className={infoStyles.navElts}>Start Report &rarr;</Link>  
            </div>

            <div style={{display: ghgView === "Overview" ? "block" : "none"}}>
              <GHGOverview/>
            </div>

            <div style={{display: ghgView === "Stats" ? "block" : "none"}}>
              <GHGStats/>
            </div>

          </div>
        </div>
      </div>

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

