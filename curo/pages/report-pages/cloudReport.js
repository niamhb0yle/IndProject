import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import reportStyles from '../../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import Likert from 'react-likert-scale';
import { useState } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { db, auth } from "../../firebase";
import { useRouter } from 'next/router';
import '../api/[...all]';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function CloudReport() {
    const [energyConsumed, setEnergyConsumed] = useState(0);
    const [carbonIntensity, setCarbonIntensity] = useState(0);
    const [embodiedEmissions, setEmbodiedEmissions] = useState(0);
    const [functionalUnit, setFunctionalUnit] = useState(1);
    const [sciScore, setSciScore] = useState(null);
    const [questionView, setQuestionView] = useState("ec");
    const [expand, setExpand] = useState(false); // true for hidden


    const [cloudData, setCloudData] = useState(null);
    const [carbonFootprint, setCarbonFootprint] = useState(null);


    /*
    const express = require('express');
    const app = express();
    app.use(express.json());

    // Mock function to represent Cloud Carbon Footprint's calculation
    // Replace this with actual Cloud Carbon Footprint integration logic
    const calculateCarbonFootprint = (data) => {
    return { footprint: '123 kg CO2', data };
    };

    app.post('/api/calculate-carbon-footprint', (req, res) => {
    try {
        const cloudData = req.body;
        const result = calculateCarbonFootprint(cloudData);
        res.json(result);
    } catch (error) {
        console.error('Error calculating carbon footprint:', error);
        res.status(500).send('Internal Server Error');
    }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
    */

    // This is all experimental stuff from the docs 

    function tryAPICall(){
        fetch('/api/regions/emissions-factors', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(response => response.json())
          .then(data => console.log(data));
    };


    const expandToggle = () => {
        setExpand(!expand);
    };

    return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.mainContainer}>
          <SideBar/>

          <div className={styles.dashboard}>
            <Header title="SCI Report"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div className={reportStyles.headingText}>Please enter the functional unit of the calculation:</div>
                    <button
                        onClick={tryAPICall}
                        className={reportStyles.nextButton}>
                        Try api call
                    </button>
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

