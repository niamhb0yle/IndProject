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

export default function Homepage() {
  const user = auth.currentUser;
  const [reportDone, setReportDone] = useState(false);
  

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.data().progress['Technical'] === true){
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
            <Header title="Technical"/>

            <div className={styles.dashboardContent}>
              <div className={infoStyles.nav}>
                <button className={infoStyles.navElts} >Overview</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <button className={infoStyles.navElts} >Insights</button>
                <p className={infoStyles.navEltsBar}>|</p>
                <ReportBtn dimension="technical" reportDone={reportDone}/>
              </div>


              <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw'}}>
                <h1>What is Technical sustainability?</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1.5 }}>
                    <p>Technical sustainability focuses on the long-term viability and adaptability of software systems. It involves ensuring that software can be maintained, evolved, and integrated with other systems over time without excessive cost or effort. </p>
                    <p>This dimension covers maintenance and evolution, resilience, and the ease of system transitions, aiming to create software that remains functional, relevant, and up-to-date throughout its lifecycle.</p>
                  </div>
                  <div style={{ width: '50%', height: '300px', overflow: 'hidden' }}>
                    <img src="/images/technical.png" alt="Technical Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                
                <h1>Why should we care?</h1>
                  <p>Technical sustainability is key to the longevity and usefulness of software. By prioritizing this dimension, developers can create systems that are robust, flexible, and capable of adapting to new technological advancements, user requirements, and operational environments. This not only enhances the user experience but also reduces the total cost of ownership and the environmental impact of software by extending its useful life.</p>
                  <p>Focusing on technical sustainability supports innovation, as it encourages the use of best practices in software design and development, including modular architecture, open standards, and reusable components. It also ensures that software can respond to and incorporate emerging technologies, keeping it at the forefront of technological advancements.</p>
                
                <h1>What are some key areas to consider?</h1>
                  <p>Here are the key areas you can focus on to improve technical sustainability in your application:</p>
                <ul>
                  <li>
                    <h1>Modular Design and Architecture: </h1>
                    <p>Adopt a modular approach to design and architecture, facilitating easier updates, maintenance, and integration with other systems</p>
                  </li>
                  <li>
                    <h1>Code Quality and Documentation: </h1>
                    <p>Ensure high code quality and comprehensive documentation to support future development efforts, maintenance, and knowledge transfer</p>
                  </li>
                  <li>
                    <h1>Interoperability: </h1>
                    <p>Ensure interoperability with other systems to extend the utility and lifespan of your software and prevent unneccessary hardware disposal</p>
                  </li>
                  <li>
                    <h1>Continuous Integration and Deployment: </h1>
                    <p>Implement CI/CD practices to streamline development, testing, and deployment processes, ensuring that software can be updated and improved continuously and efficiently</p>
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

