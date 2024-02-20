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

export default function TechnicalReport() {
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
          TechnicalQuant: quantResponses,
          TechnicalQual: qualResponses,
        });

        // set a state in the users document to signify that this report has been filled out
        await setDoc(
          userRef,
          { progress: { Technical: true } },
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
            <Header title="Technical Report"/>
            
            <div className={styles.dashboardContent}>
                <div className={reportStyles.reportContainer}>
                    <div style={{width:'90%', display: questionView === "quantitative" ? "block" : "none"}}>
                      <div className={reportStyles.headingText}>Please rank the following statements based on how much you agree with them:</div>
                      <div>
                          <p>1. The software I developed is robust</p>
                          <Likert {...likertOptions} id='1' onChange={(val) => handleLikertChange(val.value, "q1")} />
                      </div>
                      <div>
                          <p>2. Any code I pushed to the SCM was thoroughly tested</p>
                          <Likert {...likertOptions} id='2' onChange={(val) => handleLikertChange(val.value, "q2")} />
                      </div>
                      <div>
                          <p>3. I performed regular code reviews</p>
                          <Likert {...likertOptions} id='3' onChange={(val) => handleLikertChange(val.value, "q3")} />
                      </div>
                      <div>
                          <p>4. My teammates performed regular code reviews on my code</p>
                          <Likert {...likertOptions} id='4' onChange={(val) => handleLikertChange(val.value, "q4")} />
                      </div>
                      <div>
                          <p>5. I implemented load/stress testing where appropriate to ensure that the project can handle peak loads efficiently</p>
                          <Likert {...likertOptions} id='5' onChange={(val) => handleLikertChange(val.value, "q5")} />
                      </div>
                      <div>
                          <p>6. I conduct regular performance testing to identify bottlenecks and areas of improvement</p>
                          <Likert {...likertOptions} id='6' onChange={(val) => handleLikertChange(val.value, "q6")} />
                      </div>
                      <div>
                          <p>7. I used CI/CD pipelines where appropriate for automated testing, performance monitoring & deployment</p>
                          <Likert {...likertOptions} id='7' onChange={(val) => handleLikertChange(val.value, "q7")} />
                      </div>
                      <div>
                          <p>8. The team conformed to an agreed upon change management style - eg commit strategy - to maintain consistency</p>
                          <Likert {...likertOptions} id='8' onChange={(val) => handleLikertChange(val.value, "q8")} />
                      </div>
                      <div>
                          <p>9. The code I pushed to the SCM was documented thoroughly and appropriately</p>
                          <Likert {...likertOptions} id='9' onChange={(val) => handleLikertChange(val.value, "q9")} />
                      </div>
                      <div>
                          <p>10. The code I pushed to the SCM was clean and readable</p>
                          <Likert {...likertOptions} id='10' onChange={(val) => handleLikertChange(val.value, "q10")} />
                      </div>
                      <div>
                          <p>11. I was able to understand the code of my teammates due to appropriate documentation</p>
                          <Likert {...likertOptions} id='11' onChange={(val) => handleLikertChange(val.value, "q11")} />
                      </div>
                      <div>
                          <p>12. The project is portable and interoperable between different operating systems, browsers, languages etc</p>
                          <Likert {...likertOptions} id='12' onChange={(val) => handleLikertChange(val.value, "q12")} />
                      </div>
                      <div>
                          <p>13. There were initiatives to extend the lifecycle of hardware by ensuring software compatibility with older devices</p>
                          <Likert {...likertOptions} id='13' onChange={(val) => handleLikertChange(val.value, "q13")} />
                      </div>
                      <div>
                          <p>14. The software developed took the accessibility into account</p>
                          <Likert {...likertOptions} id='14' onChange={(val) => handleLikertChange(val.value, "q14")} />
                      </div>
                      <div>
                          <p>15. Error messages are included in the software where appropriate</p>
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
                        <p>1. Example question</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q1:e.target.value})} 
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

