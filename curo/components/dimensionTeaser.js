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
  
    return (
            <Link href={`/dimension-pages/${dimension}`} className={styles.dimensionTeaser} >
                <div className={styles.teaserText} style={{background:dimensionColour}}>{dimension}</div>
                <img src='/images/tick.png' alt='settings icon' width='30px'/>
            </Link>
    );
  };
  
export default DimensionTeaser;