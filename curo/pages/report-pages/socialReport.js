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

export default function SocialReport() {
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
      if (responsesCount >= 14) {
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
          SocialQuant: quantResponses,
          SocialQual: qualResponses,
        });

        // set a state in the users document to signify that this report has been filled out
        await setDoc(
          userRef,
          { progress: { Social: true } },
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
            <Header title="Social Report"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div style={{width:'90%', display: questionView === "quantitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please rank the following statements based on how much you agree with them:</div>
                      <div>
                          <p>1. Team members communicate with one another effectively</p>
                          <Likert {...likertOptions} id='1' onChange={(val) => handleLikertChange(val.value, "q1")} />
                      </div>
                      <div>
                          <p>2. The team demonstrates empathy and support for each other's well-being</p>
                          <Likert {...likertOptions} id='2' onChange={(val) => handleLikertChange(val.value, "q2")} />
                      </div>
                      <div>
                          <p>3. There is a sense of shared responsibility in the team</p>
                          <Likert {...likertOptions} id='3' onChange={(val) => handleLikertChange(val.value, "q3")} />
                      </div>
                      <div>
                          <p>4. The team celebrates team milestones and achievements to boost morale and team spirit</p>
                          <Likert {...likertOptions} id='4' onChange={(val) => handleLikertChange(val.value, "q4")} />
                      </div>
                      <div>
                          <p>5. Individual achievements and contributions are acknowledged and recognised</p>
                          <Likert {...likertOptions} id='5' onChange={(val) => handleLikertChange(val.value, "q5")} />
                      </div>
                      <div>
                          <p>6. Tools for collaboration (eg repositories, issue boards) are used effectively within the team</p>
                          <Likert {...likertOptions} id='6' onChange={(val) => handleLikertChange(val.value, "q6")} />
                      </div>
                      <div>
                          <p>7. Team members are comfortable with raising issues and addressing conflict openly</p>
                          <Likert {...likertOptions} id='7' onChange={(val) => handleLikertChange(val.value, "q7")} />
                      </div>
                      <div>
                          <p>8. Conflicts within the team are resolved in a constructive manner</p>
                          <Likert {...likertOptions} id='8' onChange={(val) => handleLikertChange(val.value, "q8")} />
                      </div>
                      <div>
                          <p>9. The team fosters an inclusive and diverse environment</p>
                          <Likert {...likertOptions} id='9' onChange={(val) => handleLikertChange(val.value, "q9")} />
                      </div>
                      <div>
                          <p>10. As a team member, you feel a sense of belonging and inclusion</p>
                          <Likert {...likertOptions} id='10' onChange={(val) => handleLikertChange(val.value, "q10")} />
                      </div>
                      <div>
                          <p>11. Team members provide constructive feedback to each other</p>
                          <Likert {...likertOptions} id='11' onChange={(val) => handleLikertChange(val.value, "q11")} />
                      </div>
                      <div>
                          <p>12. The team can adapt well to changes in the projects requirements</p>
                          <Likert {...likertOptions} id='12' onChange={(val) => handleLikertChange(val.value, "q12")} />
                      </div>
                      
                      <div>
                          <p>13. The team are open to new suggestions and are continuously trying to improve the standard of work</p>
                          <Likert {...likertOptions} id='13' onChange={(val) => handleLikertChange(val.value, "q13")} />
                      </div>
                      <div>
                          <p>14. Decisions are made collectively and all opinions are heard</p>
                          <Likert {...likertOptions} id='14' onChange={(val) => handleLikertChange(val.value, "q14")} />
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
                        <p>1. Were there any specific interpersonal conflicts or challenges that affected team morale?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q1:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>2. Were there any team initiatives or activities that fostered a sense of well-being?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q2:e.target.value})} 
                          className={reportStyles.inputBoxes}
                          >
                        </input>
                      </div>
                      <div>
                        <p>3. What technologies were used to help the teams collaboration?</p>
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

