import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionTeaser from './dimensionTeaser';

 
export default function Dashboard() {
    const [dashboardInfo, setDashboardInfo] = useState({Team:'', Lead:'', Organisation:'', ReportDue:'', Progress:''})
    const [progress, setProgress] = useState({});

    const user = auth.currentUser;

    const checkProgress = async () => {
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const userProgress = 0;
        
        if (userSnap.exists()) {
            const progressData = userSnap.data().progress;

            if (progressData) {
                let counter = 0;

                // Loop through keys of the progress map
                Object.keys(progressData).forEach((key) => {
                    // Check if the value is true
                    if (progressData[key] === true) {
                        counter++;
                    }
                });

                console.log("Number of true values:", counter);
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

        if (teamSnap.exists()) {
            setDashboardInfo({Team:teamSnap.data().name,Lead:teamSnap.data().coach,Organisation:teamSnap.data().org})
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        checkTeam();
        checkProgress();
    }, []);

  return (
    <div className={styles.dashboardContent}>
        <div style={{display:'flex',flexDirection:'row', flexWrap:'wrap'}}>
            <div style={{flex:1, padding: '5px'}}>
                <p>Here is a description of the team, with an introduction to their work. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div style={{flex:0.5, padding: '5px'}}>
                <p><b>Team:</b> {dashboardInfo.Team}</p>
                <p><b>Lead:</b> {dashboardInfo.Lead}</p> {/* TODO: change this to coach display name instead of the email */}
                <p><b>Organisation:</b> {dashboardInfo.Organisation}</p>
            </div>
        </div>

        <div className={styles.dimensionParentFlex}>
            <DimensionTeaser dimension={'HowTo'} dimensionColour={'#627E9C'} />
            <DimensionTeaser dimension={'Economic'} dimensionColour={'#AC2C4D'} />
            <DimensionTeaser dimension={'Individual'} dimensionColour={'#95A5CF'} />
            <DimensionTeaser dimension={'Environmental'} dimensionColour={'#CD474A'} />
            <DimensionTeaser dimension={'Social'} dimensionColour={'#262127'} />
            <DimensionTeaser dimension={'Technical'} dimensionColour={'#627E9C'} />
            <DimensionTeaser dimension={'SCI'} dimensionColour={'#5B4971'} />
            <DimensionTeaser dimension={'GHG'} dimensionColour={'#CD474A'} />
        </div>

    </div>
  )
}