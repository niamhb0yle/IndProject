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

const DimensionTeaser = ({ dimension, bgUrl, bgColor }) => {
    const [reportDone, setReportDone] = useState(false);
    const [howTo, setHowTo] = useState(false);
    const user = auth.currentUser;

    const checkProgress = async () => {

        if (dimension === 'HowTo'){
            setHowTo(true);
        }

        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            if (userSnap.data().progress[dimension] === true){
                setReportDone(true);
            }
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        checkProgress();
    }, []);
  
    return (
            <Link href={`/dimension-pages/${dimension}`} className={styles.dimensionTeaser} >
                <div style={{overflow:'auto'}}>
                    <div className={styles.teaserText} style={{background:`${bgColor}`}}><h1>{howTo ? 'How it works...' : dimension}</h1></div>
                </div>
            </Link>
    );
  };
  
export default DimensionTeaser;