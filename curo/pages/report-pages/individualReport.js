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

export default function IndividualReport() {
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
          IndividualQuant: quantResponses,
          IndividualQual: qualResponses,
        });

        // set a state in the users document to signify that this report has been filled out
        await setDoc(
          userRef,
          { progress: { Individual: true } },
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
            <Header title="Individual Report"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div style={{width:'90%', display: questionView === "quantitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please rank the following statements based on how much you agree with them:</div>
                      <div>
                          <p>1. You felt a ‘sense of accomplishment’ and personal growth during this sprint</p>
                          <Likert {...likertOptions} id='1' onChange={(val) => handleLikertChange(val.value, "q1")} />
                      </div>
                      <div>
                          <p>2. You feel that you can maintain a healthy work-life balance whilst working on this project</p>
                          <Likert {...likertOptions} id='2' onChange={(val) => handleLikertChange(val.value, "q2")} />
                      </div>
                      <div>
                          <p>3. Your workload is manageable</p>
                          <Likert {...likertOptions} id='3' onChange={(val) => handleLikertChange(val.value, "q3")} />
                      </div>
                      <div>
                          <p>4. You feel that there are appropriate measures are in place to address and mitigate stress and burnout</p>
                          <Likert {...likertOptions} id='4' onChange={(val) => handleLikertChange(val.value, "q4")} />
                      </div>
                      <div>
                          <p>5. You feel that your health and wellbeing are prioritised</p>
                          <Likert {...likertOptions} id='5' onChange={(val) => handleLikertChange(val.value, "q5")} />
                      </div>
                      <div>
                          <p>6. Your personal time and boundaries are being respected</p>
                          <Likert {...likertOptions} id='6' onChange={(val) => handleLikertChange(val.value, "q6")} />
                      </div>
                      <div>
                          <p>7. You feel that work was spread evenly and fairly among yourself and other team members</p>
                          <Likert {...likertOptions} id='7' onChange={(val) => handleLikertChange(val.value, "q7")} />
                      </div>
                      <div>
                          <p>8. You have opportunities for skill development or career advancement</p>
                          <Likert {...likertOptions} id='8' onChange={(val) => handleLikertChange(val.value, "q8")} />
                      </div>
                      <div>
                          <p>9. Your work arrangements were flexible - ie, you were able to work remotely if necessary</p>
                          <Likert {...likertOptions} id='9' onChange={(val) => handleLikertChange(val.value, "q9")} />
                      </div>
                      <div>
                          <p>10. You feel supported in balancing personal and professional commitments</p>
                          <Likert {...likertOptions} id='10' onChange={(val) => handleLikertChange(val.value, "q10")} />
                      </div>
                      <div>
                          <p>11. You enjoy your work</p>
                          <Likert {...likertOptions} id='11' onChange={(val) => handleLikertChange(val.value, "q11")} />
                      </div>
                      <div>
                          <p>12. You feel that your personal individual contributions and accomplishments are acknowledged and celebrated</p>
                          <Likert {...likertOptions} id='12' onChange={(val) => handleLikertChange(val.value, "q12")} />
                      </div>
                      <div>
                          <p>13. You have a clear understanding of your role within the team and what is expected of you</p>
                          <Likert {...likertOptions} id='13' onChange={(val) => handleLikertChange(val.value, "q13")} />
                      </div>
                      <div>
                          <p>14. Constructive feedback is provided to support individual growth</p>
                          <Likert {...likertOptions} id='14' onChange={(val) => handleLikertChange(val.value, "q14")} />
                      </div>
                      <div>
                          <p>15. Mentorship programs or supportive relationships are available for team members</p>
                          <Likert {...likertOptions} id='15' onChange={(val) => handleLikertChange(val.value, "q14")} />
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
                        <p>1. Were there any specific instances during this sprint where you felt your work-life balance was compromised?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q1:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>2. Are there specific skills or areas of expertise you would like to further develop, and how can the team assist you in this?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q2:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>3. In what ways do you think the team can enhance its feedback mechanisms to better support individual development?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q3:e.target.value})} 
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

