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
import questions from './questions.json';

export default function ViewReport({reportNumber, onCloseReport}) {
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
  const [sciData, setSciData] = useState({});
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
    const tempSciData = {};
  
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
  };

  console.log(sciData);

  // ability to find and display question header instead of random 'q' key
  const findQuestionText = (category, questionKey) => {
    const categoryObject = questions.find((cat) => Object.keys(cat)[0] === category);
    if (categoryObject) {
      const categoryQuestions = categoryObject[category];
      return categoryQuestions[`${questionKey}`] || "Question text not found";
    }
    return "Category not found";
  };

  return (
    <div>
      <div className={reportStyles.reportViewContent} >
        
        <h1>Report {reportNumber}<button className={reportStyles.finishReportBtn} style={{float:'right'}} onClick={() => onCloseReport()}>Close</button></h1>
        <p>Started reporting on: {dates.start}</p>
        <p>Finished report on: {dates.due}</p>
        <p>Number of members: {reportData.memberCount}</p>

        <hr style={{borderColor:'#eff1ff'}}></hr>

        <div className={reportStyles.dimensionContainerFlexParent}>
          <div className={reportStyles.dimensionContainer}>
          <h2>Social Sustainability</h2>
          {socialData.SocialQuant && Object.entries(socialData.SocialQuant).length > 0 ? (
              <div>
                {Object.entries(socialData.SocialQuant).map(([key, value]) => (
                  <div className={reportStyles.dimensionText} key={key}>
                    <progress value={value} max="5"></progress>
                    <div>{`${findQuestionText('Social', key)}: ${value}`}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Social Sustainability Data Available</p>
          )}
        </div>
        
        <div className={reportStyles.dimensionContainer}>
          <h2>Economic Sustainability</h2>
          {econData.EconomicQuant && Object.entries(econData.EconomicQuant).length > 0 ? (
              <div>
                {Object.entries(econData.EconomicQuant).map(([key, value]) => (
                  <div className={reportStyles.dimensionText} key={key}>
                    <progress value={value} max="5"></progress>
                    <div>{`${findQuestionText('Economic', key)}: ${value}`}</div></div>
                ))}
              </div>
            ) : (
              <p>No Economic Sustainability Data Available</p>
          )}
        </div>

        <div className={reportStyles.dimensionContainer}>
          <h2>Individual Sustainability</h2>
          {indData.IndividualQuant && Object.entries(indData.IndividualQuant).length > 0 ? (
              <div>
                {Object.entries(indData.IndividualQuant).map(([key, value]) => (
                  <div className={reportStyles.dimensionText} key={key}>
                    <progress value={value} max="5"></progress>
                    <div>{`${findQuestionText('Individual', key)}: ${value}`}</div></div>
                ))}
              </div>
            ) : (
              <p>No Individual Sustainability Data Available</p>
          )}
        </div>

        <div className={reportStyles.dimensionContainer}>
          <h2>Technical Sustainability</h2>
          {techData.TechnicalQuant && Object.entries(techData.TechnicalQuant).length > 0 ? (
              <div>
                {Object.entries(techData.TechnicalQuant).map(([key, value]) => (
                  <div className={reportStyles.dimensionText} key={key}>
                    <progress value={value} max="5"></progress>
                    <div>{`${findQuestionText('Technical', key)}: ${value}`}</div></div>
                ))}
              </div>
            ) : (
              <p>No Technical Sustainability Data Available</p>
          )}
        </div>
        
        <div className={reportStyles.dimensionContainer}>
          <h2>Environmental Sustainability</h2>
          {envData.EnvironmentalQuant && Object.entries(envData.EnvironmentalQuant).length > 0 ? (
              <div>
                {Object.entries(envData.EnvironmentalQuant).map(([key, value]) => (
                  <div className={reportStyles.dimensionText} key={key}>
                    <progress value={value} max="5"></progress>
                    <div>{`${findQuestionText('Environmental', key)}: ${value}`}</div></div>
                ))}
              </div>
            ) : (
              <p>No Environmental Sustainability Data Available</p>
          )}
        </div>
        </div>

        <hr></hr>

        <h1>Mini GHG and SCI data</h1>

        <div style={{display:'flex', flexDirection:'row', flex:1}}>
          <div style={{display:'flex', flex:1.2, flexDirection:'column'}}>
            <div className={reportStyles.dimensionContainer}>
              <h2>Scope 1</h2>
              {ghgData.Scope1 && Object.entries(ghgData.Scope1).length > 0 ? (
                  <div>
                    <p style={{fontSize:'17px'}}>Total emissions from team transport: {ghgData.Scope1.TransportEmissions} kg CO2</p>
                    <p style={{fontSize:'17px'}}>Total emissions from on-site generator: {ghgData.Scope1.GeneratorEmissions} kg CO2</p>
                    <hr></hr>
                    <p style={{fontSize:'17px'}}>Breakdown of team's transport modes: </p>
                    <ul>
                      {Object.entries(ghgData.Scope1.TransportBreakdown).map(([key, value]) => (
                        <li key={key}>{`${camelCaseToSpaces(key)}: ${value}`}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No GHG Data Available</p>
              )}
            </div>

            <div className={reportStyles.dimensionContainer}>
              <h2>Scope 2</h2>
              {ghgData.Scope2 && Object.entries(ghgData.Scope2).length > 0 ? (
                  <div>
                    <p style={{fontSize:'17px'}}>Offices Electricity Emissions: {ghgData.Scope2.OfficeEmissions} kg CO2</p>
                    <hr></hr>
                    <p style={{fontSize:'17px'}}>Breakdown of team's Offices: </p>
                    <ul>
                      {Object.entries(ghgData.Scope2.OfficeBreakdown).map(([key, value]) => (
                        <li key={key}>{`${camelCaseToSpaces(key)}: ${value}`}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No GHG Data Available</p>
              )}
            </div>

            <div className={reportStyles.dimensionContainer}>
              <h2>Scope 3</h2>
              {ghgData.Scope3 && Object.entries(ghgData.Scope3).length > 0 ? (
                  <div>
                    {Object.entries(ghgData.Scope3).map(([key, value]) => (
                      <div className={reportStyles.dimensionText} key={key}>
                        <p style={{fontSize:'17px'}}>{`${camelCaseToSpaces(key)}: ${value}`}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No GHG Data Available</p>
              )}
            </div>
          </div>

          <hr style={{marginLeft:'2vw', marginRight:'2vw'}}></hr>

          <div style={{display:'flex', flex:1, flexDirection:'column'}}>
            <div className={reportStyles.dimensionContainer}>
              <h2>SCI Score</h2>
              <div className={reportStyles.dimensionText}>
                {sciData.SCI && Object.entries(sciData).length > 0 ? (
                  <div>
                    <p style={{fontSize:'17px'}}>Energy Consumed by application: {sciData.EnergyConsumed}</p>
                    <p style={{fontSize:'17px'}}>Embodied Emissions: {sciData.EnergyConsumed}</p>
                    <p style={{fontSize:'17px'}}>Carbon Intensity: {sciData.CarbonIntensity}</p>
                    <p style={{fontSize:'17px'}}>Functional Unit: {sciData.FunctionalUnit}</p>
                    <hr style={{marginTop:'4vh', marginBottom:'4vh'}}></hr>
                    <p><b>Overall Software Carbon Intensity for your application: </b></p>
                    <p>{sciData.SCI} kg of CO2 per unit of work</p>
                  </div>
                ) : (
                  <p>No SCI Data Available</p>
                )}
              </div>
            </div>
          </div>
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

