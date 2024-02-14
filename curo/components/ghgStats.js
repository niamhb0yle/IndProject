import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import reportStyles from '../styles/Reports.module.css';
import infoStyles from '../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { auth, db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function GHGStats() {
  const [scope1data, setscope1data] = useState({});
  const [scope2data, setscope2data] = useState({});
  const [scope3data, setscope3data] = useState({});
  const [transportData, setTransportData] = useState({});


  const readInData = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team
    const teamSnap = await getDoc(teamRef);
    const reportNumber = String(teamSnap.data().CurrentReport.number);
    const reportRef = doc(teamRef, "Reports", reportNumber);
    const reportSnap = await getDoc(reportRef);

    setscope1data(reportSnap.data().Scope1);
    setscope2data(reportSnap.data().Scope2);
    setscope3data(reportSnap.data().Scope3);
  }

  useEffect(() => {
    readInData();
  },[]);

  useEffect(() => {
    if (scope1data && scope1data.TransportBreakdown) {
      let transportDataTemp = Object.keys(scope1data.TransportBreakdown).map((key) => ({
        name: key,
        count: scope1data.TransportBreakdown[key],
      }));

      setTransportData(transportDataTemp);
    }
  }, [scope1data]);

  return (
    <div className={infoStyles.infoContent}>
        
        <div style={{display:'flex', flex:1, flexDirection:'row' }}>

          <div className={infoStyles.statsView} style={{flex:0.6}}>
            <h1>Team Transport Breakdown</h1>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={transportData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={infoStyles.statsView} style={{flex:0.4}}>

          </div>
        
        </div>

    </div>
    )
}

