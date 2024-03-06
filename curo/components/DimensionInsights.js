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
import questions from './questions.json';

export default function DimensionInsights({dimension}) {
  const [dimensionData, setDimensionData] = useState(0);
  const [barchartData, setBarchartData] = useState([]);
  const [firstReport, setFirstReport] = useState(false);

  useEffect(() => {
    readInData();
  }, []);

  const readInData = async () => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      const teamRef = userSnap.data().Team;
      const teamSnap = await getDoc(teamRef);
      const reportNumber = String(teamSnap.data().CurrentReport.number - 1);
      if (reportNumber === "0") {
        setFirstReport(true);
        return;
      }
      const reportRef = doc(teamRef, "Reports", reportNumber);
      const reportSnap = await getDoc(reportRef);

      let dimensionString = dimension + "Quant";
      let data = reportSnap.data()[dimensionString];
      if (data) {
        setDimensionData(data);
        processData(data);
      }
    } catch (error) {
      console.error("Error reading data:", error);
    }
  };

  const processData = (dimensionData) => {
    if (!dimensionData) {
      console.error("Dimension data is null or undefined");
      return;
    }

    const questionArray = questions.find(q => Object.keys(q).includes(dimension));
    if (!questionArray) {
      console.error("Dimension not found in questions");
      return;
    }

    console.log(dimensionData);
    let dataEntries = Object.keys(dimensionData).map((key) => ({
      name: questionArray[dimension][key],
      value: dimensionData[key],
    }));

    setBarchartData(dataEntries);
  };

  return (
    <div>
      <div className={infoStyles.infoContent} style={{maxWidth:'90vw', padding: '2vw'}}>
        {!firstReport ? (
          <>
            <h1>Your Application's last {dimension} scores:</h1>
            <ResponsiveContainer height={300}>
              <BarChart data={barchartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884D8" /> 
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <h1>First report - no data yet!</h1>
        )}
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
