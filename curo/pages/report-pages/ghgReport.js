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

export default function SCIReport() {
  const [energyConsumed, setEnergyConsumed] = useState(0);
  const [carbonIntensity, setCarbonIntensity] = useState(0);
  const [embodiedEmissions, setEmbodiedEmissions] = useState(0);
  const [functionalUnit, setFunctionalUnit] = useState(1);
  const [sciScore, setSciScore] = useState(null);
  const [questionView, setQuestionView] = useState("ec");
  const [expand, setExpand] = useState(false); // true for hidden

  const [cloudData, setCloudData] = useState(null);
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/calculate-carbon-footprint', {
        method: 'POST',
        body: JSON.stringify(cloudData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCarbonFootprint(data);
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
    }
  };

  const expandToggle = () => {
    setExpand(!expand);
  }

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
                    
                    <input
                        className={reportStyles.inputBoxes}
                        style={{width:'400px'}}
                        type="number"
                        value={energyConsumed}
                        onChange={(e) => setEnergyConsumed(e.target.value)}
                        placeholder="Functional Unit"
                        
                    />

                    <div onClick={() => expandToggle()} className={reportStyles.expand} style={{width: expand ? "700px" : "400px"}}>
                        <h1>Unsure of what this means?</h1>
                        <div className={`${reportStyles.expandContent} ${expand ? reportStyles.expanded : ''}`}>
                        <p style={{display: expand ? "block" : "none"}}>Energy consumed is the total electrical energy (in kilowatt-hours, kWh) that the hardware running the software system uses over a certain period or for a specific amount of work.</p>
                        <p style={{display: expand ? "block" : "none"}}>It can be measured in various ways depending on the context:
                        In a data center or server environment, it might be the energy reported by the facility or estimated based on the server's power usage and operating time.
                        For cloud-based services, cloud providers often provide metrics or estimates of energy usage for the resources (like virtual machines or cloud functions) utilized.
                        In a desktop or mobile context, it could involve estimating the energy use of the device while running the software.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={reportStyles.nextButton}>
                        Calculate
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

