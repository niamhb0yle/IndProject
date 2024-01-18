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

const DimensionTeaser = ({ dimension, dimensionColour }) => {
    const [reportDone, setReportDone] = useState(false);
    const user = auth.currentUser;

    const checkProgress = async () => {

        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            console.log(userSnap.data().progress[dimension])
            if (userSnap.data().progress[dimension] === true){
                setReportDone(true);
            }
        } else {
            console.log("No such document!");
        }
        console.log(dimension, reportDone);
    };

    useEffect(() => {
        checkProgress();
    }, []);
  
    return (
            <Link href={`/dimension-pages/${dimension}`} className={styles.dimensionTeaser} >
                <div style={{overflow:'auto'}}>
                    <div className={styles.teaserText} style={{background:dimensionColour}}>{dimension}</div>
                    <img src={reportDone ? '/images/tick.png' : '/images/cross.png'} alt='settings icon' width='50px' style={{float:'right', marginRight:'20px', marginTop:'15px'}} />
                </div>
            </Link>
    );
  };
  
export default DimensionTeaser;