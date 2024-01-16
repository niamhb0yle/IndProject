import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import Likert from 'react-likert-scale';
import { useState } from 'react';

export default function Economic() {
    const [quantResponses, setQuantResponses] = useState({});
    const [qualResponses, setQualResponses] = useState({});
    const [nextAvailable, setNextAvailable] = useState(true);
    const [questionView, setQuestionView] = useState("quantitative");
    const responsesCount = Object.keys(quantResponses).length;
    
    const likertOptions = {
        responses: [
          { value: 1, text: "Strongly Disagree" },
          { value: 2, text: "Disagree" },
          { value: 3, text: "Neutral" },
          { value: 4, text: "Agree" },
          { value: 5, text: "Strongly Agree" }
        ]
      };

    const handleLikertChange = async (val, questionId) => {
        await setQuantResponses(prevResponses => ({
        ...prevResponses,
        [questionId]: val
        }));
        console.log(questionId, val);
        console.log(quantResponses, "responses count: ", responsesCount);
        if (responsesCount === 15) {
            setNextAvailable(false);
        }
    };

    const handleSubmit = () => {
      if (questionView === "quantitative"){
        console.log("Quantitative responses:", quantResponses);
        setQuestionView("qualitative");
        // Add logic to send 'responses' to Firebase here
      }
      else if (questionView === "qualitative"){
        console.log(qualResponses);
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
                <div style={{background:'#F8F8F8', width:'100%', height:'fit-content', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)', borderRadius:30, padding:30, overflow:'auto'}}>
                    <div style={{width:'75%', display: questionView === "quantitative" ? "block" : "none"}}>
                      <p style={{fontSize:22, fontWeight:600, marginBottom: 40, color:'black'}}>Please rank the following statements based on how much you agree with them:</p>
                      <div>
                          <p style={{fontSize:18}}>1. The team met the sprint's defined goals and objectives within the allocated budget</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q1")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>2. Initiatives were in place to ensure job security for team members</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q2")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>3. There were professional development opportunities for the team members</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q3")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>4. The team supports learning and career advancement for team members</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q4")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>5. Compensation structures within the team were fair</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q5")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>6. The project positively contributed to economic growth in its community or industry</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q6")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>7. The team actively sought ways to contribute to the economic wellbeing of stakeholders</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q7")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>8. Efforts were made to minimize the environmental impact of the project's infrastructure</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q8")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>9. The team invested in innovative technologies or practices to improve efficiency</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q9")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>10. Innovation was a priority in project planning and execution</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q10")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>11. The team actively engages in activities that enhance the competitiveness of the industry</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q11")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>12. Resources, including time and personnel, were allocated efficiently throughout the project</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q12")} />
                      </div>
                      
                      <div>
                          <p style={{fontSize:18}}>13. The team conducted cost-benefit analyses for major project decisions</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q13")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>14. The team prioritizes activities with a positive cost-benefit ratio</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q14")} />
                      </div>
                      <div>
                          <p style={{fontSize:18}}>15. Decisions were made with a focus on maximizing the project's economic benefits</p>
                          <Likert {...likertOptions} onChange={(val) => handleLikertChange(val.value, "q15")} />
                      </div>
                      <button
              
                          onClick={handleSubmit}
                          className={styles.ReportBtn}
                          style={{
                            background: !nextAvailable ? "#18392B" : "gray",
                            cursor: !nextAvailable ? "pointer" : "default",
                            width: "fit-content",
                            borderRadius: "30px",
                            fontFamily:"Montserrat",
                            fontSize:"22px",
                            color:"white",
                            padding:"15px",
                            border:"none",
                            float:"right",
                          }}>
                          Continue &rarr;
                      </button>
                    </div>
                    <div style={{width:"75%", display: questionView === "qualitative" ? "block" : "none"}}>
                      <p style={{fontSize:22, fontWeight:600, marginBottom: 40, color:'black'}}>Please provide feedback in the following areas where appropriate:</p>
                      <div>
                        <p style={{fontSize:18}}>1. Were there any cost overruns, and what were the contributing factors?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q1:e.target.value})} 
                          style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', margin:5, fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
                          >
                        </input>
                      </div>
                      <div>
                        <p style={{fontSize:18}}>2. What efforts did the team make to reduce technical debt?</p>
                        <input 
                          onChange={(e) => setQualResponses({...qualResponses, q2:e.target.value})} 
                          style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', margin:5, fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
                          >
                        </input>
                      </div>
                      <button
                          onClick={handleSubmit}
                          className={styles.ReportBtn}
                          style={{
                            background: "#18392B",
                            cursor: "pointer",
                            width: "fit-content",
                            borderRadius: "30px",
                            fontFamily:"Montserrat",
                            fontSize:"22px",
                            color:"white",
                            padding:"15px",
                            border:"none",
                            float:"right",
                          }}>
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
