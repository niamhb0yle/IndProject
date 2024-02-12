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

export default function GHG() {

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

            <div className={infoStyles.infoContent}>
              
              <div style={{display:'flex', flex:1, flexDirection:'row'}}>
                <div style={{flex:0.5}}>
                  <h1>What is GHG Reporting?</h1>
                  <p>Greenhouse Gas (GHG) reporting involves the quantification of emissions released by an entity, which are contributing to global warming. This reporting is crucial for understanding environmental impacts and is the first step towards implementing strategies for reducing carbon footprints.</p>
                </div>
                <div style={{flex:0.5}}>
                  <h1>Why fill out a mini report?</h1>
                  <p>The mini-GHG report project is designed to simplify the process of calculating and understanding greenhouse gas emissions for small teams or organizations. By focusing on a more accessible and streamlined approach, it aims to raise awareness about the importance of GHG reporting and encourage proactive steps towards sustainability.</p>
                </div>
              </div>

              <h1>The Three Scopes of Emissions</h1>
              <p>GHG emissions are categorized into three scopes by the Greenhouse Gas Protocol, a global standardized framework for measuring and managing emissions. Each scope represents different sources of emissions, helping organizations to identify where they can most effectively reduce their greenhouse gas output.</p>
              
              <div style={{display:'flex', flex:1, flexDirection:'row', flexWrap:'wrap', alignContent:'flex-start'}}>
                <div className={infoStyles.scopeBox}>
                  <h1>Scope 1</h1>
                  <p>Direct Emissions</p>
                  <p>Definition: Emissions from sources that are directly owned or controlled by the entity.</p>
                  <p>Examples: Emissions from combustion in owned or controlled boilers, furnaces, vehicles; emissions from chemical production in owned or controlled process equipment.</p>
                </div>
                
                <div className={infoStyles.scopeBox}>
                  <h1>Scope 2</h1>
                  <p>Indirect Emissions from Purchased Electricity</p>
                  <p>Definition: Emissions from the generation of purchased electricity consumed by the entity.</p>
                  <p>Examples: Emissions stemming from electricity used to power computers, lights, and machinery in a facility that the reporting entity does not own or control.</p>
                </div>
                
                <div className={infoStyles.scopeBox}>
                  <h1>Scope 3</h1>
                  <p>Other Indirect Emissions</p>
                  <p>Definition: Emissions that are a consequence of the activities of the entity but occur from sources not owned or controlled by the entity.</p>
                  <p>Examples: Emissions associated with business travel, procurement, waste disposal, and the use of sold products and services.</p>
                </div>
                
              </div>
              
              <h1>Aim of the Mini-GHG Report</h1>
              <p>The mini-GHG report targets these three scopes of emissions, with a special emphasis on simplifying the process for smaller entities that may not have the resources for comprehensive GHG reporting. The project focuses on:</p>
              <li>Facilitating Understanding: Making it easier for individuals and small teams to grasp the basics of GHG emissions and their sources.</li>              
              <li>Streamlining Calculation: Providing tools or methods to calculate emissions from common activities within the scopes, without needing extensive data or complex formulas.</li>              
              <li>Promoting Action: Encouraging entities to take actionable steps towards reducing their emissions based on their report findings.</li>

              <Link href='../report-pages/scope1Report' className={reportStyles.reportBtn}>Start mini GHG report &rarr;</Link>
              
              
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

