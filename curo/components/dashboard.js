import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

 
export default function Dashboard() {
    const [dashboardInfo, setDashboardInfo] = useState({Team:'', Lead:'', Organisation:'', ReportDue:'', Progress:''})

    const user = auth.currentUser;

    const checkTeam = async () => {

        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team

        if (userSnap.exists()) {
            const teamRef = userSnap.data().Team
        } else {
            console.log("No such document!");
        }

        const teamSnap = await getDoc(teamRef);

        if (teamSnap.exists()) {
            setDashboardInfo({Team:teamSnap.data().name,Lead:teamSnap.data().coach,Organisation:teamSnap.data().org})
        } else {
            console.log("No such document!");
        }
    };


  return (
    <div className={styles.dashboardContent}>
        <div style={{display:'flex',flexDirection:'row', flexWrap:'wrap'}}>
            <div style={{flex:1, padding: '5px'}}>
                <p>Here is a description of the team, with an introduction to their work. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <button onClick={checkTeam}></button>
            </div>
            <div style={{flex:0.5, padding: '5px'}}>
                <p><b>Team:</b> {dashboardInfo.Team}</p>
                <p><b>Lead:</b> {dashboardInfo.Lead}</p>
                <p><b>Organisation:</b> {dashboardInfo.Organisation}</p>
            </div>
        </div>

        <div className={styles.dimensionParentFlex}>
            <Link href='/dimension-pages/economic' className={styles.dimensionTeaser} style={{background: 'linear-gradient(180deg, darkgreen 0%, darkgreen 60%, white 60%, white 100%)'}}>
                <div className={styles.teaserText}>Economic</div>
            </Link>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background: 'linear-gradient(180deg, rgb(79, 167, 117) 0%, rgb(79, 167, 117) 60%, white 60%, white 100%)'}}>
                <div className={styles.teaserText}>Technical</div>
            </Link>
            <Link href='/dimension-pages/environmental' className={styles.dimensionTeaser} style={{background: 'linear-gradient(180deg, #7661E2 0%, #7661E2 60%, white 60%, white 100%)'}}>
                <div className={styles.teaserText}>Environmental</div>
            </Link>
            <Link href='/dimension-pages/social' className={styles.dimensionTeaser} style={{background: 'linear-gradient(180deg, #FABE7A 0%, #FABE7A 60%, white 60%, white 100%)'}}>
                <div className={styles.teaserText}>Social</div>
            </Link>
            <Link href='/dimension-pages/individual' className={styles.dimensionTeaser} style={{background: 'linear-gradient(180deg, #9DC1F8 0%, #9DC1F8 60%, white 60%, white 100%)'}}>
                <div className={styles.teaserText}>Individual</div>
            </Link>
            <Link href='/dimension-pages/sci' className={styles.dimensionTeaser} style={{background: 'linear-gradient(180deg, #F6866A 0%, #F6866A 60%, white 60%, white 100%)'}}>
                <div className={styles.teaserText}>SCI Score</div>
            </Link>
        </div>

    </div>
  )
}