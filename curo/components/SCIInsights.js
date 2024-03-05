import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import reportStyles from '../styles/Reports.module.css';
import infoStyles from '../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { auth, db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, } from 'recharts';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function SCI() {
  const [view, setView] = useState('Overview');
  const [userType, setUserType] = useState('');
  const [reportDone, setReportDone] = useState(false);
  const user = auth.currentUser;

  const getFirestoreData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
    if (userSnap.data().userType === "lead"){
      if (userSnap.data().progress['SCI'] === true){
        setReportDone(true);
      }
    }
  }


  useEffect(() => {
    getFirestoreData();
  }, []);

  return (
    <div>
      
      <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw', display: view === "Overview" ? 'block' : 'none'}}>
        <h1>Software Carbon Intensity over your reports:</h1>
        
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

