import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import ReportBtn from '../../components/reportBtn';
import { auth, db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

export default function Ecconomic() {
  const user = auth.currentUser;
  const [reportDone, setReportDone] = useState(false);
  

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.data().progress['Economic'] === true){
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
            <Header title="Economic"/>

            <div className={styles.dashboardContent}>
              <p>In the realm of software sustainability, prioritizing the management of technical debt emerges as a crucial economic strategy. It brings about resource efficiency, long-term cost savings, and boosts developer productivity. Through the cultivation of clean and well-documented code, development teams optimize their human resources, reducing time spent on debugging and problem-solving. This not only maximizes the value of investments in software development but also fortifies economic sustainability.</p>
              <p>Proactively addressing technical debt leads to substantial long-term cost savings by preventing unforeseen expenses tied to critical issues and system failures. Moreover, fostering a positive work environment through clear code and reduced technical debt promotes developer satisfaction and teamwork, minimizing turnover costs and fostering innovation.</p>
              <p>Customer satisfaction, a direct outcome of software free from technical debt, contributes to user loyalty and retention, supporting economic sustainability by ensuring a stable user base. Additionally, addressing technical debt positions software systems to be adaptable to change, allowing organizations to stay competitive and respond effectively to evolving business needs.</p>
              <p>Lastly, considering the environmental impact is not overlooked. Optimized and well-maintained code consumes fewer computational resources, aligning with broader goals of energy efficiency and environmental sustainability in computing. In essence, reducing technical debt is a comprehensive economic strategy that enhances efficiency, reduces costs, and aligns software development practices with broader economic and environmental sustainability goals.</p>
              
              <ReportBtn dimension="economic" reportDone={reportDone}/>

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

