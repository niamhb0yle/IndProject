import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import settingsStyles from '../../styles/Settings.module.css';
import dashboardStyles from '../../styles/Dashboard.module.css';
import reportStyles from '../../styles/Reports.module.css';
import infoStyles from '../../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionTeaser from '../../components/dimensionTeaser';
import Header from '../../components/Header';
import SideBar from '../../components/sidebar';
import 'react-circular-progressbar/dist/styles.css';
import DimensionOverview from '../../components/dimensionOverview';

export default function HowTo() {

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.mainContainer}>
          <SideBar/>

          <div className={dashboardStyles.dashboard}>
            <Header title="How it works..."/>

            <div className={styles.dashboardContent}>
  
              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw'}}>
                <h1>How do you track your progress?</h1>
                <div style={{ flex: 1.5 }}>
                  <p>Curo spreads out your team’s progression into ‘reports’. Each report has a report number, a start date, and a due date (which is visible at the top of your dashboard). Every member of the team should aim to complete the tasks they have been assigned by the report due date, which will also appear in your dashboard. Once every member has completed all of their assigned tasks, the team lead can navigate to their ‘reports’ page (found in the sidebar), and compile the report. </p>
                  <p>Upon report compilation, every members questionnaire responses are averaged, and collated into one report which can be viewed in the ‘past reports’ section of the reports page. Results from the mini GHG report and the SCI calculator will also be provided in the report once compiled.</p>
                  <p>The tasks themselves are comprised of two things - sustainable dimension questionnaires, and carbon emission estimation reports. You can see which reports you will have to fill out below in ‘roles’…</p>
                </div>
                
                <h1>What are the sustainable dimensions?</h1>
                <p>We have developed simple, yet effective forms based on all the current research in the software sustainability field. 
                  Currently, researchers define software sustainability as being made up of five dimensions - economic, technical, environmental, social, and individual. 
                  You can view more information on each of these dimensions on their respective pages, which are available via your dashboard. 
                  Once you have familiarised yourself with each sustainability dimension, complete the questionnaire by clicking ‘start report’ at the top of the page. </p>

                <h1>Agile Integration</h1>
                <p>The app is designed in a way which fits in with the typical agile methodology used in software engineering. Whether your team use Scrum, Kanban, or Scrum-ban - our app should fit right into your teams workstyle.</p>
                <p>We have implemented an ‘issue board’ feature, similar to other agile issue creation . You have all the key features of an agile issue board here - assignees, story points, titles and descriptions - and can change the status of an issue simply by dragging and dropping it into a new column.</p>
                <p>There is also an option to export past reports as markdown files, so that they can be easily added into a repository.</p>
                <p>Since this is a reporting tool, we encourage teams to integrate this into your existing agile ceremonies - whether this be sprint retrospectives (highly recommended), or even sprint planning meetings (use the issue board tool to map out sustainable goals for the next sprint).</p>
              
                <h1>Roles</h1>
                <p>There are two roles on Curo - developer, and team lead. Typically, any scrum master, product owner or manager would fall under the ‘team lead’ category, and anyone else in the team would fall under ‘developer’. 
                  Here is a quick overview of the requirements of both roles for every team report being filled out:</p>
                <div style={{display:'flex', flex:1, flexDirection:'row', gap:'2vw'}}>
                  <div style={{flex:1, borderRadius:'30px', background:'#eff1ff'}}>
                    <h2 style={{fontFamily:'Montserrat', color:'black', fontSize:'calc(22px + 0.2vw)', margin:'4vh'}}>Team Lead</h2>
                    <ul>
                      <li>Complete the questionnaire for each sustainable dimension</li>
                      <li>Complete SCI and GHG reports for team</li>
                      <li>Add and update issues</li>
                      <li><b>Compile the report</b></li>
                      <li>Review and export the compiled report</li>
                      <li>Edit team info</li>
                      <li><b>Invite new members</b></li>
                      <li><b>Remove members</b></li>
                    </ul>
                  </div>
                  <div style={{flex:1, borderRadius:'30px', background:'#eff1ff'}}>
                    <h2 style={{fontFamily:'Montserrat', color:'black', fontSize:'calc(22px + 0.2vw)', margin:'4vh'}}>Developer</h2>
                    <ul>
                      <li>Complete the questionnaire for each sustainable dimension</li>
                      <li>View SCI and GHG overviews and insights</li>
                      <li>Add and update issues</li>
                      <li>Review and export the compiled report</li>
                    </ul>
                  </div>
                </div>

              </div>
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

