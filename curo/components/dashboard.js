import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionTeaser from './dimensionTeaser';
import Header from './Header';

 
export default function Dashboard() {
    const [dashboardInfo, setDashboardInfo] = useState({Team:'', Lead:'', Organisation:'', ReportDue:'', Progress:'', Members:[], reportNo:''})
    const [progress, setProgress] = useState(0);

    const user = auth.currentUser;

    const checkProgress = async () => {
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const progressData = userSnap.data().progress;

            if (progressData) {
                let counter = 0;
                Object.keys(progressData).forEach((key) => {
                    if (progressData[key] === true) {
                        counter++;
                    }
                });

                console.log("Number of true values:", counter);
                setProgress(Math.round((counter/6)*100));
            }
        } else {
            console.log("No such document!");
        }
    }

    const checkTeam = async () => {

        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team

        if (userSnap.exists()) {
            const teamRef = userSnap.data().Team;
            setProgress(userSnap.data().progress);
        } else {
            console.log("No such document!");
        }

        const teamSnap = await getDoc(teamRef);

        console.log(teamSnap.data().CurrentReport.number);

        if (teamSnap.exists()) {
            setDashboardInfo({
                Team:teamSnap.data().name,
                Lead:teamSnap.data().coach,
                Organisation:teamSnap.data().org,
                Members: teamSnap.data().Members || [],
                ReportNo: teamSnap.data().CurrentReport.number,
            })
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        checkTeam();
        checkProgress();
    }, []);

    const headerText = `${dashboardInfo.Team} Dashboard`

  return (
    <div>
        <Header title={headerText} />
        <div className={styles.dashboardContent}>
            <div className={styles.dashboardInfo}>
                <div style={{flex:0.33, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <p>You are on report:</p>
                    <h1>{dashboardInfo.ReportNo}</h1>
                </div>
                <div style={{flex:0.33, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <p><b>Team:</b> {dashboardInfo.Team}</p>
                    <p><b>Lead:</b> {dashboardInfo.Lead}</p> {/* TODO: change this to coach display name instead of the email */}
                    <p><b>Organisation:</b> {dashboardInfo.Organisation}</p>
                </div>
                <div style={{flex:0.33, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <p><b>Progress:</b> {progress}%</p>
                    <p><b>Members:</b> {dashboardInfo.Members.length}</p>
                </div>
            </div>

            <div className={styles.dimensionParentFlex}>
                <DimensionTeaser dimension={'HowTo'} bgUrl={'/images/fuzzy_blue.jpeg'} />
                <DimensionTeaser dimension={'Economic'} bgUrl={'/images/fuzzy_green.jpeg'} />
                <DimensionTeaser dimension={'Individual'} bgUrl={'/images/fuzzy_orange.jpeg'} />
                <DimensionTeaser dimension={'Environmental'} bgUrl={'/images/fuzzy_pink.jpeg'} />
                <DimensionTeaser dimension={'Social'} bgUrl={'/images/fuzzy_blue.jpeg'} />
                <DimensionTeaser dimension={'Technical'} bgUrl={'/images/fuzzy_green.jpeg'} />
                <DimensionTeaser dimension={'SCI'} bgUrl={'/images/fuzzy_orange.jpeg'} />
                <DimensionTeaser dimension={'GHG'} bgUrl={'/images/fuzzy_blue.jpeg'} />
            </div>

        </div>
    </div>
  )
}