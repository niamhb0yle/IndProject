import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import reportStyles from '../styles/Reports.module.css';
import infoStyles from '../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { auth, db } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function SCI() {
    const [sciData, setSciData] = useState(0);
    const [transportData, setTransportData] = useState({});
    const [scopeData, setScopeData] = useState([]);
    const [firstReport, setFirstReport] = useState(false);
    const colours = ['#9d5dce', '#4627b2', '#354cfc'];

    const dummySCIData = [
        { reportNumber: 'Report 1', sciScore: 120 },
        { reportNumber: 'Report 2', sciScore: 150 },
        { reportNumber: 'Report 3', sciScore: 180 },
        { reportNumber: 'Report 4', sciScore: 165 },
      ];
      
  
    const readInData = async () => {
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      const teamRef = userSnap.data().Team;
      const teamSnap = await getDoc(teamRef);
      const currentReportNumber = teamSnap.data().CurrentReport.number;
      const reports = [];

      for (let i = 1; i < currentReportNumber; i++) {
        const reportNumber = String(i);
        const reportRef = doc(teamRef, "Reports", reportNumber);
        const reportSnap = await getDoc(reportRef);
        const sciScore = reportSnap.data().SCI.SCI;
        const reportString = "Report " + reportNumber;
        reports.push({ reportString, sciScore });
      }

      setSciData(reports);
      console.log(reports);
    };

    useEffect(() => {
      readInData();
    },[]);

  return (
    <div>
      
      <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw'}}>
        <h1>Your Application's Software Carbon Intensity over time:</h1>
        <ResponsiveContainer width="100%" height={400} style={{ padding: '2vw' }}>
          <LineChart
            width={500}
            height={300}
            data={sciData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="reportString"/>
            <YAxis label={{ value: 'SCI Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sciScore" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        
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

