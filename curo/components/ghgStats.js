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
import cloudEmissions from '../pages/report-pages/cloudEmissions.json';

export default function GHGStats() {
  const [selectedProvider, setSelectedProvider] = useState('AWS');
  const [filteredData, setFilteredData] = useState([]);

  // Populate the filtered data based on the selected provider
  useEffect(() => {
    const providerData = cloudEmissions.filter(item => item.cloudProvider === selectedProvider);
    setFilteredData(providerData);
  }, [selectedProvider]);

  


  return (
    <div className={infoStyles.infoContent}>
        
        <div style={{display:'flex', flex:1, flexDirection:'row' }}>

          <div className={infoStyles.statsView} style={{flex:1, padding:'1.5vw'}}>
          <div className={infoStyles.statsHeading}>Cloud Computing Emission Factors by Provider</div>
            <select value={selectedProvider} className={reportStyles.inputBoxes} style={{marginLeft:'3vw', width:'7vw', fontSize:'calc(15px + 0.3vw)', display:'inline'}} onChange={(e) => setSelectedProvider(e.target.value)}>
              {Array.from(new Set(cloudEmissions.map(item => item.cloudProvider)))
                .map(provider => <option key={provider} value={provider}>{provider}</option>)}
            </select>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mtPerKwHour" name="Metric Tons of CO2 per KiloWatt Hour (mt/kWh)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            
          </div>
        
        </div>

    </div>
    )
}

