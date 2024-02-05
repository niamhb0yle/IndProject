import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import reportStyles from '../../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import 'firebase/firestore';
import '../api/[...all]';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import emissionFactors from './scope2emissionFactors.json';
import Link from 'next/link';


export default function Scope2Report() {

  const getEmissionFactor = (country) => emissionFactors[country];
  const [selectedCountry, setSelectedCountry] = useState('');
  const [displayCountries, setDisplayCountries] = useState('No');

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
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
            <Header title=""/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                <div className={reportStyles.scopeHeadingText}>
                  Scope 1&rarr;  <span style={{color:'black'}}>Scope 2  </span> &rarr;  Scope 3
                </div>

                <div className={reportStyles.headingText}>Purchased Electricity</div>

                  <p>Does your team work in an office with an electricity supply?</p>
                  <select 
                    value={displayCountries} 
                    onChange={(e) => setDisplayCountries(e.target.value)}
                    className={reportStyles.inputBoxes}
                    style={{width:'50%'}}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                  </select>

                  <div style={{display: displayCountries === "Yes" ? "block" : "none", }}>
                    <p>Please select the location of your office space from the dropdown listed, along with  (if your team are spread internationally, you may add multiple office spaces)</p>
                    
                    <div style={{height:'fit-content', background:'#ededed', padding:'10px', marginBottom:'10px', borderRadius:'20px'}}>
                      <select 
                        value={selectedCountry} 
                        onChange={handleCountryChange}
                        className={reportStyles.inputBoxes}
                        style={{width:'45%', display:'inline'}}>
                        <option value="">Location</option>
                        {Object.keys(emissionFactors).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <input
                          className={reportStyles.inputBoxes}
                          style={{width:'45%', display:'inline'}}
                          type="number"
                          placeholder="Activity data (kWh)"
                        />
                    </div>


                  </div>

                  <Link href="./scope3Report" 
                  className={reportStyles.reportBtn} 
                  >
                    Continue to scope 3 &rarr;
                  </Link>

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

