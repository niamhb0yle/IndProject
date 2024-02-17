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

export default function EnvironmentalReport() {
    const [quantResponses, setQuantResponses] = useState({});
    const [qualResponses, setQualResponses] = useState({});
    const [questionView, setQuestionView] = useState("quantitative");
    const router = useRouter();
    const user = auth.currentUser;
    
    const likertOptions = {
        responses: [
          { value: 1, text: "Strongly Disagree" },
          { value: 2, text: "Disagree" },
          { value: 3, text: "Neutral" },
          { value: 4, text: "Agree" },
          { value: 5, text: "Strongly Agree" }
        ]
      };

    const handleLikertChange = (val, questionId) => {
      setQuantResponses(prevResponses => ({
        ...prevResponses,
        [questionId]: val
      }));
      
    };

    const handleSubmitNew = async () => {
      if (questionView === 'quantitative') {
        console.log('Quantitative responses:', quantResponses);
        setQuestionView('qualitative');

      } else if (questionView === 'qualitative') {
        console.log('Qualitative responses:', qualResponses);
  
        // getting existing document references to update data
        const userId = user.email; 
        const reportNumber = "1"; // TODO: Replace with the actual report number
  
        const userRef = doc(db, "Users", userId);
        const reportRef = doc(userRef, "Reports", reportNumber);

        await updateDoc(reportRef, {
          EnvironmentalQuant: quantResponses,
          EnvironmentalQual: qualResponses,
        });

        // set a state in the users document to signify that this report has been filled out
        await setDoc(
          userRef,
          { progress: { Environmental: true } },
          { merge: true }
        );

        // redirect to dashboard
        router.push('../sidebar/dashboard');
      }
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
            <Header title="Environmental Report"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div style={{width:'90%', display: questionView === "quantitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please rank the following statements based on how much you agree with them:</div>
                      <div>
                          <p>1. The team is consistently looking to optimize code for energy efficiency</p>
                          <Likert {...likertOptions} id='1' onChange={(val) => handleLikertChange(val.value, "q1")} />
                      </div>
                      <div>
                          <p>2. The team is conscious of the environmental impact related to energy use in software development</p>
                          <Likert {...likertOptions} id='2' onChange={(val) => handleLikertChange(val.value, "q2")} />
                      </div>
                      <div>
                          <p>3. Sustainable development practices are integrated into the team's workflow</p>
                          <Likert {...likertOptions} id='3' onChange={(val) => handleLikertChange(val.value, "q3")} />
                      </div>
                      <div>
                          <p>4. Code review processes include considerations for the environmental impact of the codebase where appropriate</p>
                          <Likert {...likertOptions} id='4' onChange={(val) => handleLikertChange(val.value, "q4")} />
                      </div>
                      <div>
                          <p>5. Environmental impact is a factor in the selection of technologies and tools for the project, eg servers</p>
                          <Likert {...likertOptions} id='5' onChange={(val) => handleLikertChange(val.value, "q5")} />
                      </div>
                      <div>
                          <p>6. The team makes an effort to reduce waste in terms of time and resources during the development process</p>
                          <Likert {...likertOptions} id='6' onChange={(val) => handleLikertChange(val.value, "q6")} />
                      </div>
                      <div>
                          <p>7. The team seeks out and adopts green technologies and practices where appropriate</p>
                          <Likert {...likertOptions} id='7' onChange={(val) => handleLikertChange(val.value, "q7")} />
                      </div>
                      <div>
                          <p>8. The team considers the environmental impact of hardware disposal in its decision-making processes by creating software which is backwards compatible with older devices</p>
                          <Likert {...likertOptions} id='8' onChange={(val) => handleLikertChange(val.value, "q8")} />
                      </div>
                      <div>
                          <p>9. Plans are in place for the responsible disposal or recycling of hardware rendered obsolete by software development or updates</p>
                          <Likert {...likertOptions} id='9' onChange={(val) => handleLikertChange(val.value, "q9")} />
                      </div>
                      <div>
                          <p>10. Cloud-based solutions are optimized for efficiency to minimize environmental impact</p>
                          <Likert {...likertOptions} id='10' onChange={(val) => handleLikertChange(val.value, "q10")} />
                      </div>
                      <div>
                          <p>11. On-premises data centers, if used, are operated sustainably with environmental considerations</p>
                          <Likert {...likertOptions} id='11' onChange={(val) => handleLikertChange(val.value, "q11")} />
                      </div>
                      <div>
                          <p>12. Carbon emissions related to development activities are monitored and addressed by the team</p>
                          <Likert {...likertOptions} id='12' onChange={(val) => handleLikertChange(val.value, "q12")} />
                      </div>
                      <div>
                          <p>13. Strategies are in place to offset or mitigate the environmental impact of the team's activities, eg investing in carbon offset programs</p>
                          <Likert {...likertOptions} id='13' onChange={(val) => handleLikertChange(val.value, "q13")} />
                      </div>
                      <div>
                          <p>14. Efforts are made to transition to or support renewable energy providers</p>
                          <Likert {...likertOptions} id='14' onChange={(val) => handleLikertChange(val.value, "q14")} />
                      </div>
                      <div>
                          <p>15. The team actively seeks feedback on its environmental sustainability practice</p>
                          <Likert {...likertOptions} id='15' onChange={(val) => handleLikertChange(val.value, "q15")} />
                      </div>
                      <button
                          onClick={handleSubmitNew}
                          className={reportStyles.nextButton}
                          style={{
                            background: Object.keys(quantResponses).length < 15 ? "gray" : "#18392B",
                            cursor: Object.keys(quantResponses).length < 15 ? "default" : "pointer",
                          }}>
                          Continue &rarr;
                      </button>
                    </div>
                    <div style={{width:"90%", display: questionView === "qualitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please provide feedback in the following areas where appropriate:</div>
                      <div>
                        <p>1. What sustainable development practices did the team use to minimize the environmental impact of the project?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q1:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>2. Were any green technologies or practices adopted during the sprint?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q2:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>3. Were plans in place for the responsible disposal or recycling of hardware that became obsolete due to software development or updates?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q3:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>4. Were cloud-based solutions optimized for efficiency, or were on-premises data centers used sustainably?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q4:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <button
                          onClick={handleSubmitNew}
                          className={reportStyles.nextButton}>
                          Submit
                      </button>
                    </div>
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

