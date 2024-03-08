import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import firebase from 'firebase/app';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const DimensionOverview = ({ teamsDocumentId, currentReportNumber }) => {
  const [dimensionData, setDimensionData] = useState([]);
  const [firstReport, setFirstReport] = useState(false);

useEffect(() => {
    console.log(parseInt(currentReportNumber) > 1)
    if (parseInt(currentReportNumber) > 1) {
        fetchDimensionData();
        setFirstReport(false);
    } else if (parseInt(currentReportNumber) === 1){
        setFirstReport(true);
    }
}, [teamsDocumentId, currentReportNumber]);

  const fetchDimensionData = async () => {
    const teamRef = doc(db, "Teams", String(teamsDocumentId));
    const lastReportNumber = currentReportNumber - 1;
    const reportRef = doc(teamRef, "Reports", String(lastReportNumber));
    const reportData = (await getDoc(reportRef)).data();

    if (reportData) {
        calculateAverageScores(reportData);
    }
    };

    const calculateAverageScores = (reportData) => {
        const dimensionData = {
            economic: reportData.EconomicQuant,
            environmental: reportData.EnvironmentalQuant,
            social: reportData.SocialQuant,
            individual: reportData.IndividualQuant,
            technical: reportData.TechnicalQuant,
          };
      
          // for each dimension, take an average score of their quantitative data 
          const averageScores = []; 
          for (const dimension in dimensionData) {
              const scores = dimensionData[dimension];
              let sum = 0;
              let count = 0;
              for (const score of Object.values(scores)) {
                  sum += score;
                  count++;
              }
              const average = sum / count;
              averageScores.push({name: dimension, avgScore: average}); // Create an object with dimension name and its average score
          }
      
          setDimensionData(averageScores); 
        };


  return (
        <div>
            {!firstReport ? (
                <div style={{paddingTop:'1vh', paddingLeft:'1vh'}}>
                    <p>Your teams last dimension scores:</p>
                    <ResponsiveContainer width="100%" height={190}>
                        <BarChart
                            data={dimensionData}
                            margin={{ top: 15, right: 30,  left:0, bottom: 2 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="avgScore" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div>
                    <p>No data - this is your team's first report!</p>
                </div>
            )}
        </div>
  );
};

export default DimensionOverview;
