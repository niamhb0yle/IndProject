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

export default function Economic() {
    const [quantResponses, setQuantResponses] = useState({});
    const [qualResponses, setQualResponses] = useState({});
    const [nextAvailable, setNextAvailable] = useState(true);
    const [questionView, setQuestionView] = useState("quantitative");
    const responsesCount = Object.keys(quantResponses).length + 1;
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
      console.log(responsesCount);
      if (responsesCount >= 15) {
        setNextAvailable(false);
      }
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
          EconomicQuant: quantResponses,
          EconomicQual: qualResponses,
        });

        // set a state in the users document to signify that this report has been filled out
        await setDoc(
          userRef,
          { progress: { Economic: true } },
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
            <Header title="Economic"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div style={{width:'90%', display: questionView === "quantitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please rank the following statements based on how much you agree with them:</div>
                      <div>
                          <p>1. The team met the sprint's defined goals and objectives within the allocated budget</p>
                          <Likert {...likertOptions} id='1' onChange={(val) => handleLikertChange(val.value, "q1")} />
                      </div>
                      <div>
                          <p>2. Initiatives were in place to ensure job security for team members</p>
                          <Likert {...likertOptions} id='2' onChange={(val) => handleLikertChange(val.value, "q2")} />
                      </div>
                      <div>
                          <p>3. There were professional development opportunities for the team members</p>
                          <Likert {...likertOptions} id='3' onChange={(val) => handleLikertChange(val.value, "q3")} />
                      </div>
                      <div>
                          <p>4. The team supports learning and career advancement for team members</p>
                          <Likert {...likertOptions} id='4' onChange={(val) => handleLikertChange(val.value, "q4")} />
                      </div>
                      <div>
                          <p>5. Compensation structures within the team were fair</p>
                          <Likert {...likertOptions} id='5' onChange={(val) => handleLikertChange(val.value, "q5")} />
                      </div>
                      <div>
                          <p>6. The project positively contributed to economic growth in its community or industry</p>
                          <Likert {...likertOptions} id='6' onChange={(val) => handleLikertChange(val.value, "q6")} />
                      </div>
                      <div>
                          <p>7. The team actively sought ways to contribute to the economic wellbeing of stakeholders</p>
                          <Likert {...likertOptions} id='7' onChange={(val) => handleLikertChange(val.value, "q7")} />
                      </div>
                      <div>
                          <p>8. Efforts were made to minimize the environmental impact of the project's infrastructure</p>
                          <Likert {...likertOptions} id='8' onChange={(val) => handleLikertChange(val.value, "q8")} />
                      </div>
                      <div>
                          <p>9. The team invested in innovative technologies or practices to improve efficiency</p>
                          <Likert {...likertOptions} id='9' onChange={(val) => handleLikertChange(val.value, "q9")} />
                      </div>
                      <div>
                          <p>10. Innovation was a priority in project planning and execution</p>
                          <Likert {...likertOptions} id='10' onChange={(val) => handleLikertChange(val.value, "q10")} />
                      </div>
                      <div>
                          <p>11. The team actively engages in activities that enhance the competitiveness of the industry</p>
                          <Likert {...likertOptions} id='11' onChange={(val) => handleLikertChange(val.value, "q11")} />
                      </div>
                      <div>
                          <p>12. Resources, including time and personnel, were allocated efficiently throughout the project</p>
                          <Likert {...likertOptions} id='12' onChange={(val) => handleLikertChange(val.value, "q12")} />
                      </div>
                      
                      <div>
                          <p>13. The team conducted cost-benefit analyses for major project decisions</p>
                          <Likert {...likertOptions} id='13' onChange={(val) => handleLikertChange(val.value, "q13")} />
                      </div>
                      <div>
                          <p>14. The team prioritizes activities with a positive cost-benefit ratio</p>
                          <Likert {...likertOptions} id='14' onChange={(val) => handleLikertChange(val.value, "q14")} />
                      </div>
                      <div>
                          <p>15. Decisions were made with a focus on maximizing the project's economic benefits</p>
                          <Likert {...likertOptions} id='15' onChange={(val) => handleLikertChange(val.value, "q15")} />
                      </div>
                      <button
                          disabled={nextAvailable}
                          onClick={handleSubmitNew}
                          className={reportStyles.nextButton}
                          style={{
                            background: !nextAvailable ? "#18392B" : "gray",
                            cursor: !nextAvailable ? "pointer" : "default",
                          }}>
                          Continue &rarr;
                      </button>
                    </div>
                    <div style={{width:"90%", display: questionView === "qualitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please provide feedback in the following areas where appropriate:</div>
                      <div>
                        <p>1. Were there any cost overruns, and what were the contributing factors?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q1:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>2. What efforts did the team make to reduce technical debt?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q2:e.target.value})} 
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

