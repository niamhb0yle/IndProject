import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import infoStyles from '../../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import ReportBtn from '../../components/reportBtn';
import { auth, db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

export default function Individual() {
  const user = auth.currentUser;
  const [reportDone, setReportDone] = useState(false);
  

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.data().progress['Individual'] === true){
      setReportDone(true);
    }
  }

  useEffect(() => {
    getFirestoreData();
  }, []);

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
            <Header title="Individual"/>

            <div className={styles.dashboardContent}>
              <div className={infoStyles.nav}>
                <button className={infoStyles.navElts} >Overview</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <button className={infoStyles.navElts} >Insights</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <ReportBtn dimension="individual" reportDone={reportDone}/>
              </div>


              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw'}}>
                <h1>What is Individual sustainability?</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1.5 }}>
                    <p>Individual sustainability is deeply rooted in the principles of individual freedom, human dignity, and fulfillment. It's about creating software that doesn't just serve functional needs but also enhances the personal experiences and lives of those it touches. This dimension recognizes the importance of considering the well-being and development of all stakeholders involved, from end-users to developers and beyond.</p>
                    <p>The central question for software development teams under this dimension is: How can our software positively impact the lives of everyone it reaches, contributing to their sense of dignity, freedom, and fulfillment?</p>
                  </div>
                  <div style={{ width: '50%', height: '300px', overflow: 'hidden' }}>
                    <img src="/images/individual.png" alt="Individual Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <h1>Why should we care?</h1>
                  <p>In simple terms, individual sustainability focuses on creating products that respect and promote the autonomy of end-users, whilst also fostering an enjoyable, creative environment for developers and other stakeholders.</p>
                  <p>We should care about implementing these changes in our own applications because of the benefits that every stakeholder will reap. For users, software that prioritizes individual sustainability can lead to enhanced satisfaction, loyalty, and advocacy, as it aligns with their personal values and improves their quality of life. For developers and other stakeholders, focusing on individual sustainability can lead to a more engaged, productive, and innovative team, which in turn contributes to the overall success and sustainability of the project.</p>
                  <p>Prioritizing the needs and well-being of stakeholders ensures that software development is not just about meeting technical requirements, but also about creating value which resonates on a personal level. It's about building software that people <b>love to use</b>, and are <b>proud to be associated with.</b></p>
                <h1>What are some key areas to consider?</h1>
                  <p>Here are the key areas you can focus on to improve individual sustainability in your application:</p>
                <ul>
                  <li>
                    <h1>Developer Wellbeing: </h1>
                    <p>Create a supportive work environment which prioritises a healthy work-life balance for its developers, encourages personal growth, and effectively mitigates stress and burnout</p>
                  </li>
                  <li>
                    <h1>Improving users quality of life</h1>
                    <p>Design your software with the end users quality of life in mind. This includes ensuring accessibility, privacy, and security, and creating meaningful, enjoyable user interactions</p>
                  </li>
                  <li>
                    <h1>Ethical considerations</h1>
                    <p>Consider the implications of your software: are there any ethical concerns? If so, make sure there are guidelines in place to safeguard individuals</p>
                  </li>
                  <li>
                    <h1>Stakeholder engagement</h1>
                    <p>Ensure that your stakeholders - products owners, investors, senior managers etc are actively engaged in your application</p>
                  </li>
                </ul>
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

