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
  const [reportData, setReportData] = useState({});
  const [dates, setDates] = useState({start:'', due:''})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialData, setSocialData] = useState({});
  const [indData, setIndData] = useState({});
  const [techData, setTechData] = useState({});
  const [envData, setEnvData] = useState({});
  const [econData, setEconData] = useState({});
  const [ghgData, setGhgData] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    const fetchReportData = async () => {
      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);
      const teamRef = userSnap.data().Team;
  
      setLoading(true);
      try {
        const reportRef = doc(db, `Teams/${teamRef.id}/Reports/${reportNumber}`);
        const docSnap = await getDoc(reportRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReportData(data);
  
          // Now that reportData is set, format the dates using the newly fetched data
          if (data.start && data.due) {
            const start = data.start.toDate();
            const due = data.due.toDate();
            setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
          }
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
  }, [reportNumber, user.email]);
  
  const renderData = (data, title) => (
    <>
      <h4>{title}</h4>
      <ul>
        {Object.entries(data).map(([question, value]) => (
          <li key={question}>{`${question}: ${Array.isArray(value) ? value.join(', ') : value}`}</li>
        ))}
      </ul>
    </>
  );

  // Function to render each category's data, including handling GHG scopes under a main GHG heading
  const renderCategoryData = () => (
    <>
      {Object.keys(reportData).map((category) => {
        if (['Scope1', 'Scope2', 'Scope3'].includes(category)) return null;

        // Check if category is one of the GHG scopes, render them under GHG heading
        if (category === 'EconomicQuant' || category === 'EconomicQual') {
          return (
            <div key={category}>
              <h3>{category.includes('Quant') ? 'Economic Quantitative' : 'Economic Qualitative'}</h3>
              {renderData(reportData[category], '')}
            </div>
          );
        } else {
          // Render other categories normally
          return (
            <div key={category}>
              <h3>{category.replace('Quant', ' Quantitative').replace('Qual', ' Qualitative')}</h3>
              {renderData(reportData[category], '')}
            </div>
          );
        }
      })}

      <div>
        <h2>GHG</h2>
        {['Scope1', 'Scope2', 'Scope3'].map((scope) => (
          <div key={scope}>
            {reportData[scope] && (
              <>
                <h3>{scope}</h3>
                {renderData(reportData[scope], 'Quantitative')}
                {reportData[`${scope}Qual`] && renderData(reportData[`${scope}Qual`], 'Qualitative')}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );


  return (
    <div>
      <div className={infoStyles.reportViewContent}>
        <h1>Report {reportNumber}</h1>
        <p>Started reporting on: {dates.start}</p>
        <p>Finished report on: {dates.due}</p>
        {reportData ? (
        <div>
          {renderCategoryData()}
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

