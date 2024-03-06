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
import DimensionInsights from '../../components/DimensionInsights';
import { auth, db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

export default function Social() {
  const user = auth.currentUser;
  const [view, setView] = useState('Overview');
  const [reportDone, setReportDone] = useState(false);
  

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.data().progress['Social'] === true){
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
            <Header title="Social"/>

            <div className={styles.dashboardContent}>
              <div className={infoStyles.nav}>
                <button className={infoStyles.navElts} onClick={() => setView("Overview")} style={{color: view === "Overview" ? "#354cfc" : "black"}}>Overview</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <button className={infoStyles.navElts} onClick={() => setView("Insights")} style={{color: view === "Insights" ? "#354cfc" : "black"}} >Insights</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <ReportBtn dimension="social" reportDone={reportDone}/>
              </div>


              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw', display: view ==="Overview" ? 'block' : 'none'}}>
                <h1>What is Social sustainability?</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1.5 }}>
                    <p>Social sustainability in software development focuses on the impact that software has on social systems, relationships, and structures. It encompasses creating software that supports mutual trust, effective communication, and the balance of diverse interests within society. This dimension urges developers to consider how their software influences and is influenced by social norms, values, and the fabric of communities.</p>
                    <p>In practice, social sustainability involves designing software that is inclusive, promotes equity, and fosters a sense of community and belonging. It also promotes social wellbeing within the development team - sustainability starts with the developers. It's about ensuring that software development processes and products respect human rights, encourage positive social interactions, and contribute to the social good.</p>
                  </div>
                  <div style={{ width: '50%', height: '300px', overflow: 'hidden' }}>
                    <img src="/images/social.png" alt="Social Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <h1>Why should we care?</h1>
                  <p>Software that prioritizes social sustainability can play a crucial role in shaping more cohesive, inclusive, and supportive communities - <b>starting with your team!</b> By taking into account the social dimensions, developers can create products that not only meet technical and functional requirements but also address societal challenges, reduce inequalities, and promote social well-being.</p>
                  <p>Focusing on social sustainability helps build stronger, more trusting relationships between users, developers, and stakeholders, enhancing the reputation of the software product and the organization behind it. It ensures that technology serves as a force for good, capable of bringing people together and making positive contributions to society.</p>
                
                <h1>What are some key areas to consider?</h1>
                  <p>Here are the key areas you can focus on to improve social sustainability in your application:</p>
                <ul>
                  <li>
                    <h1>Cohesion in development team: </h1>
                    <p>Ensure that your team communicates and works together effectively. You should be able to address conflict openly within the team, and foster a sense of belonging and inclusion</p>
                  </li>
                  <li>
                    <h1>Celebrate milestones together: </h1>
                    <p>Make sure that your team celebrates both individual and group achievements! Team morale contributes to a positive and productive working environment</p>
                  </li>
                  <li>
                    <h1>Inclusivity and Accessibility: </h1>
                    <p>Accessibility should not be an afterthought in software design - keep it in the forefront of your mind when developing your application</p>
                  </li>
                </ul>
              </div>

              <div style={{display: view === "Insights" ? 'block': 'none'}}>
                <DimensionInsights dimension="Social"/>
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

