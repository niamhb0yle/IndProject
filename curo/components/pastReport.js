import Link from 'next/link';
import Head from 'next/head';
import infoStyles from '../styles/Info.module.css';
import reportStyles from '../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileExport } from '@fortawesome/free-solid-svg-icons';
import questions from './questions.json';

export default function PastReport({ onSelectReport, reportNumber }) {
  const [dates, setDates] = useState({start:'', due:''})
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialData, setSocialData] = useState({});
  const [indData, setIndData] = useState({});
  const [techData, setTechData] = useState({});
  const [envData, setEnvData] = useState({});
  const [econData, setEconData] = useState({});
  const [ghgData, setGhgData] = useState({});
  const [sciData, setSciData] = useState({});
  const [noMembers, setNoMembers] = useState(0);
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
          processAndCategorizeData(data); // Correctly placed call
  
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
  
    if (user && reportNumber) { // Ensure user and reportNumber are defined before fetching
      fetchReportData();
    }
  }, [reportNumber, user]); // Make sure to include all dependencies here

  // make it more user friendly - display keys which are displayed as camel case with a space in between
  function camelCaseToSpaces(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); })
  }
  
  
  
  const processAndCategorizeData = (data) => {
    const ghgCategories = ['Scope1', 'Scope2', 'Scope3'];
  
    // Temporary objects to hold categorized data
    const tempSocialData = {};
    const tempIndData = {};
    const tempTechData = {};
    const tempEnvData = {};
    const tempEconData = {};
    const tempGhgData = {};
  
    Object.keys(data).forEach((key) => {
      if (key.includes('SocialQuant') || key.includes('SocialQual')) {
        tempSocialData[key] = data[key];
      } else if (key.includes('IndividualQuant') || key.includes('IndividualQual')) {
        tempIndData[key] = data[key];
      } else if (key.includes('TechnicalQuant') || key.includes('TechnicalQual')) {
        tempTechData[key] = data[key];
      } else if (key.includes('EnvironmentalQuant') || key.includes('EnvironmentalQual')) {
        tempEnvData[key] = data[key];
      } else if (key.includes('EconomicQuant') || key.includes('EconomicQual')) {
        tempEconData[key] = data[key];
      } else if (ghgCategories.some(category => key.includes(category))) {
        tempGhgData[key] = data[key];
      }
    });
  
    // Update state with categorized data
    setSocialData(tempSocialData);
    setIndData(tempIndData);
    setTechData(tempTechData);
    setEnvData(tempEnvData);
    setEconData(tempEconData);
    setGhgData(tempGhgData);
    setSciData(data.SCI);
    setNoMembers(data.memberCount);
  };

  // ability to find and display question header instead of random 'q' key
  const findQuestionText = (category, questionKey) => {
    const categoryObject = questions.find((cat) => Object.keys(cat)[0] === category);
    if (categoryObject) {
      const categoryQuestions = categoryObject[category];
      return categoryQuestions[`${questionKey}`] || "Question text not found";
    }
    return "Category not found";
  };

  useEffect(() => {
    const getDates = async () =>{
      const user = auth.currentUser;

      const userRef = doc(db, "Users", user.email);
      const userSnap = await getDoc(userRef);

      const teamRef = userSnap.data().Team; // Assuming this is directly the team ID
      const reportRef = doc(db, `Teams/${teamRef.id}/Reports/${reportNumber}`);
      const reportSnap = await getDoc(reportRef);

      if (reportSnap.exists()) {
        const start = reportSnap.data().start.toDate();
        const due = reportSnap.data().due.toDate();
        setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
      } else {
        console.log("No such report!");
      }
  }

  getDates();
  }, [])

  function convertDataToMarkdown() {
    let markdown = `# Report Number: ${reportNumber}\n\n`;
    // Example conversion (expand according to your data structure)
    markdown += `## Start Date: ${dates.start}\n`;
    markdown += `## Due Date: ${dates.due}\n\n`;
    markdown += `## No of Members: ${noMembers}\n`;
    markdown += `--------------------------\n`;
    markdown += `## Social Sustainability Data\n`;
    {Object.entries(socialData.SocialQuant).map(([key, value]) => (
        markdown += `${findQuestionText('Social', key)}: ${value} \n`,
        markdown += ` \n`
    ))}
    markdown += `## Technical Sustainability Data\n`;
    {Object.entries(techData.TechnicalQuant).map(([key, value]) => (
        markdown += `${findQuestionText('Technical', key)}: ${value} \n`,
        markdown += ` \n`
    ))}
    markdown += `## Environmental Sustainability Data\n`;
    {Object.entries(envData.EnvironmentalQuant).map(([key, value]) => (
        markdown += `${findQuestionText('Environmental', key)}: ${value} \n`,
        markdown += ` \n`
    ))}
    markdown += `## Economic Sustainability Data\n`;
    {Object.entries(econData.EconomicQuant).map(([key, value]) => (
        markdown += `${findQuestionText('Economic', key)}: ${value} \n`,
        markdown += ` \n`
    ))}
    markdown += `## Individual Sustainability Data\n`;
    {Object.entries(indData.IndividualQuant).map(([key, value]) => (
        markdown += `${findQuestionText('Individual', key)}: ${value} \n`,
        markdown += ` \n`
    ))}
    markdown += `## Mini GHG Data\n`;
    markdown += `### Scope 1\n`;
    markdown += `Generator Emissions: ${ghgData.Scope1.GeneratorEmissions}\n \n`;
    markdown += `Transport Emissions: ${ghgData.Scope1.TransportEmissions}\n \n`;
    markdown += `### Scope 2\n`;
    markdown += `Office Emissions: ${ghgData.Scope2.OfficeEmissions}\n \n`;
    markdown += `### Scope 3\n`;
    markdown += `Cloud Emissions: ${ghgData.Scope3.CloudEmissions}\n \n`;


    markdown += `## SCI Data\n`;
    markdown += `Energy Consumed by application: ${sciData.EnergyConsumed} \n \n`;
    markdown += `Embodied Emissions: ${sciData.EnergyConsumed} \n \n`;
    markdown += `Carbon Intensity: ${sciData.CarbonIntensity} \n \n`;
    markdown += `Functional Unit: ${sciData.FunctionalUnit} \n \n`;
    markdown += `Overall Software Carbon Intensity for your application: ${sciData.SCI} \n`;
    return markdown;
  }

  // Function to trigger the download of Markdown file
  function downloadMarkdown(markdown, filename) {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Handler for the export button
  function handleExportReport() {
    const markdown = convertDataToMarkdown(reportData);
    downloadMarkdown(markdown, `Report_${reportNumber}`);
  }


  return (
    <div>
      <div className={reportStyles.pastReportContainer}>
        <div className={reportStyles.pastReportElt}>
            <p>Report {reportNumber}</p>
        </div>
        <div className={reportStyles.pastReportElt}>
            <p>Finished: {dates.due}</p>
        </div>
        <div className={reportStyles.viewExportBtn}>
            <div onClick={() => onSelectReport(reportNumber)}>View report </div><FontAwesomeIcon icon={faEye} style={{width:'calc(14px + 0.2vw)'}}/>
        </div>
        <div className={reportStyles.viewExportBtn} onClick={handleExportReport}>
            <>Export report</> <FontAwesomeIcon icon={faFileExport} style={{width:'calc(14px + 0.2vw)'}} />
        </div>
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

