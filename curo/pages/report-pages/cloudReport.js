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


export default function CloudReport() {
    const [regionalEmissions, setRegionalEmissions] = useState([]);
    const [providerRegions, setProviderRegions] = useState({});
    const [expand, setExpand] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    function tryAPICall() {
        fetch('/api/regions/emissions-factors', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setRegionalEmissions(data);
        })
        .catch(error => console.error('Error fetching emissions factors:', error));
        console.log('help');
    }

    function populateData(){
        console.log(regionalEmissions);
        const tempProviderRegions = {};

        // loop through each entry in regionalEmissions
        regionalEmissions.forEach((emission) => {
            if (emission.cloudProvider != "ALI"){ // discard entries under ALI - all in foreign language, outside scope
                const provider = emission.cloudProvider;
                const region = emission.region;

                // check if the provider key exists, if not initialize it with an empty array
                if (!tempProviderRegions[provider]) {
                    tempProviderRegions[provider] = [];
                }

                // check if the region is not already included to avoid duplicates
                if (!tempProviderRegions[provider].includes(region)) {
                    tempProviderRegions[provider].push(region);
                }
            }
        });

        setProviderRegions(tempProviderRegions);
        console.log(tempProviderRegions);
    }
    
    // if regionalEmissions is updated, then populate regions and cloud providers for user to choose from
    useEffect(() => {
        if (regionalEmissions.length > 0) { // error checking in case api call didn't work
            populateData();
          }
    }, [regionalEmissions]);

    const expandToggle = () => {
        setExpand(!expand);
    };

    const regionOptions = selectedProvider ? providerRegions[selectedProvider] : [];

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
            <Header title="Cloud Report"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div className={reportStyles.headingText}>Please enter all the details of your cloud computing resource to calculate the carbon emissions</div>
                        <p>Select your cloud provider:</p>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className={reportStyles.inputBoxes}
                            style={{width:'50%'}}
                        >
                            <option value="">Select a provider</option>
                            {Object.keys(providerRegions).map((provider, index) => (
                            <option key={index} value={provider}>
                                {provider}
                            </option>
                            ))}
                        </select>
                    <br></br>

                    <div style={{display: selectedProvider != "" ? "block" : "none"}}>
                        <p>Select your region:</p>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className={reportStyles.inputBoxes}
                            style={{width:'50%'}}
                        >
                        <option value="">Select a region</option>
                            {regionOptions.map((region, index) => (
                                <option key={index} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br></br>

                    <div style={{display: selectedRegion != "" ? "block" : "none"}}>
                        <p>Select a start/end date:</p>
                        <div style={{width:'50%', padding:'10px', display:'inline'}}>
                            <DatePicker
                                showIcon
                                selected={startDate}
                                onChange={(date) => setStartDate(date)} 
                            />
                        </div>

                        <div style={{width:'50%', padding:'10px', display:'inline'}}>
                            <DatePicker
                            showIcon
                            selected={endDate}
                            onChange={(date) => setEndDate(date)} 
                            />
                        </div>
                    </div>

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

