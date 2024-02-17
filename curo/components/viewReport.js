import Link from 'next/link';
import Head from 'next/head';
import infoStyles from '../styles/Info.module.css';
import reportStyles from '../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ViewReport({reportNumber}) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const reportRef = doc(db, `Teams/${teamId}/Reports/${reportNumber}`);
        const docSnap = await getDoc(reportRef);

        if (docSnap.exists()) {
          setReportData(docSnap.data());
        } else {
          setError('No such report found');
        }
      } catch (err) {
        setError('Error fetching report data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportNumber]);



  return (
    <div>
      <div className={infoStyles.reportViewContent}>
        <h1>Report {reportNumber}</h1>
        {reportData ? (
        <div>
          <h2>Quantitative Data</h2>
          {Object.entries(reportData.quantitativeMeans || {}).map(([category, values]) => (
            <div key={category}>
              <h3>{category}</h3>
              {Object.entries(values).map(([question, mean]) => (
                <p key={question}>{`Question ${question}: ${mean}`}</p>
              ))}
            </div>
          ))}
          <h2>Qualitative Data</h2>
          {Object.entries(reportData.qualitativeResponses || {}).map(([category, responses]) => (
            <div key={category}>
              <h3>{category}</h3>
              {Object.entries(responses).map(([question, responseList]) => (
                <div key={question}>
                  <h4>Question {question}</h4>
                  {responseList.map((response, index) => (
                    <p key={index}>{response}</p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No report data available</p>
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

