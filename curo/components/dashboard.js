import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';
import settingsStyles from '../styles/Settings.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionTeaser from './dimensionTeaser';
import Header from './Header';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle } from '@fortawesome/free-solid-svg-icons'

export default function Dashboard() {
    const [dashboardInfo, setDashboardInfo] = useState({Team:'', Lead:'', Organisation:'', Progress:'', ReportDue:'', Members:{}, reportNo:'', Due:''})
    const [progress, setProgress] = useState('');
    const [memberProfiles, setMemberProfiles] = useState({});
    const [teamProgress, setTeamProgress] = useState('');
    const [progressView, setProgressView] = useState('personal');
    const [todoList, setTodoList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [expandReports, setExpandReports] = useState({todo:false, done:false});
    const user = auth.currentUser;    

    const updateProgress = async (todo, done) => {
        let total = todo.length + done.length;
        let progress = Math.round((done.length/total)*100);
        console.log(done, todo, total, progress)

        setProgress(progress);
    }

    const checkProgress = async () => {
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const progressData = userSnap.data().progress;

            if (progressData) {
                let tempTodo = [];
                let tempDone = [];
                
                Object.keys(progressData).forEach((key) => {
                    if (progressData[key] === true) {
                        tempDone.push(key);
                    } else {
                        tempTodo.push(key);
                    }
                });
    
                // Update state once after constructing the full lists
                await setTodoList(tempTodo);
                await setDoneList(tempDone);

                await updateProgress(tempTodo, tempDone);
            }
        } else {
            console.log("No such document!");
        }
    }

    const expand = (e) => {
        if (e === "done"){
            setExpandReports({...expandReports, done:!expandReports.done})
        }
        if (e === "todo"){
            setExpandReports({...expandReports, todo:!expandReports.todo})
        }
    }

    const checkTeam = async () => {

        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team;
        const teamSnap = await getDoc(teamRef);
        const members = teamSnap.data().Members || [];

        // calculating the overall team progress
        let tempTotalReports = 0;
        let tempTotalReportsCompleted = 0;
        let membersNames = {};
        let memberProfiles = {};

        await Promise.all(members.map(async (member) => {
            const memberRef = doc(db, "Users", member);
            const memberSnap = await getDoc(memberRef);
            const memberProgress = memberSnap.data().progress;
            membersNames[member] = memberSnap.data().username;
            if (memberSnap.data().photoUrl){
                memberProfiles[member] = memberSnap.data().photoUrl;
            } else {
                memberProfiles[member] = '/images/user.png';
            }
            Object.keys(memberProgress).forEach((key) => {
                if (memberProgress[key] === true) {
                    tempTotalReportsCompleted++;
                }
                tempTotalReports++;
            });
        }));

        let tempTeamProgress = Math.round((tempTotalReportsCompleted/tempTotalReports)*100);
        await setTeamProgress(tempTeamProgress);
        await setMemberProfiles(memberProfiles);
        let dueDate = new Date(teamSnap.data().CurrentReport.due.toDate()).toLocaleDateString();

        if (teamSnap.exists()) {
            setDashboardInfo({
                Team:teamSnap.data().name,
                Lead:teamSnap.data().coach,
                Organisation:teamSnap.data().org,
                ReportNo: teamSnap.data().CurrentReport.number,
                Members: membersNames,
                Due: dueDate
            })
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        checkTeam();
        checkProgress();
    }, []);

    const triggerProgressView = () => {
        if (progressView === 'personal') {
            setProgressView('team');
        } else {
            setProgressView('personal');
        }
    }

    const headerText = `${dashboardInfo.Team} Dashboard`

  return (
    <div>
        <Header title={headerText} />
        <div className={styles.dashboardContent}>
            

            <div className={styles.dimensionParentFlex}>
            <div style={{display:'flex', flexDirection:'row', flex:1, height:'fit-content'}}>
                  <div style={{display:'flex', flexDirection:'column', flex:1, flexWrap:'wrap'}}>

                    <div style={{display:'flex', flexDirection:'row', flex:1}}>

                    <div className={styles.dashboardInfo}>
                      <div style={{flex: 0.4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                          <p>Team report due:</p>
                          <h2>{dashboardInfo.Due}</h2>
                      </div>
                      <div className={settingsStyles.vl} style={{marginTop:'3vh', marginBottom:'3vh',  marginRight:'0vh', marginLeft:'0vh'}}></div>
                      <div style={{flex: 0.4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                          <p>Your tasks completed:</p>
                          <h1>{doneList.length}</h1>
                      </div>
                      <div className={settingsStyles.vl} style={{marginTop:'3vh',  marginBottom:'3vh', marginRight:'0vh', marginLeft:'0vh'}}></div>
                      <div style={{flex: 0.4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                          <p>Your tasks to do:</p>
                          <h1>{todoList.length}</h1>
                      </div>
                    </div>

                    </div>

                    <div style={{display:'flex', flexDirection:'row', flex:1}}>
                      <div style={{flex:1, height:'fit-content', background:'white', margin:'20px', borderRadius:'30px', boxShadow:'2px 2px 10px rgba(100, 55, 254, 0.1)',  marginBottom:'0',}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding:'2vw'}}>
                            <div style={{marginBottom:'2vh'}}>
                                <p style={{display:'inline'}}>{progressView === 'personal' ? 'Your progress: ' : 'Teams progress: '} <FontAwesomeIcon icon={faShuffle} className={styles.shuffle} onClick={triggerProgressView} /></p>
                            </div>
                            
                            <div style={{width:'8vw', height:'8vw'}}>
                                <CircularProgressbar value={progressView === 'personal' ? progress : teamProgress} text={`${progressView === 'personal' ? progress : teamProgress}%`} styles={buildStyles({pathColor: `#354CFC`, textColor: '#354CFC',trailColor: '#d6d6d6'})}/>
                            </div>
                        </div>
                      </div>
                      <div style={{flex:1, height:'fit-content', background:'white', margin:'20px', marginBottom:'0', borderRadius:'30px', boxShadow:'2px 2px 10px rgba(100, 55, 254, 0.1)'}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding:'2vw'}}>
                          <p style={{marginBottom:'2vh'}}>Whole team progress:</p>
                          <div style={{width:'8vw', height:'8vw'}}>
                              <CircularProgressbar value={teamProgress} text={`${teamProgress}%`} styles={buildStyles({pathColor: `#354CFC`, textColor: '#354CFC',trailColor: '#d6d6d6'})}/>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  <div style={{display:'flex', flexDirection:'column', flex:0.5, background:'#3044e3', borderRadius:'30px', margin:'20px'}}>
                    <h1 style={{color:'white', fontFamily:'Montserrat', margin:'3vh', marginBottom:'2vh'}}>Members ({Object.keys(dashboardInfo.Members).length})</h1>
                    {dashboardInfo.Members && Object.entries(dashboardInfo.Members).map(([email, name]) => (
                        <div key={email} className={styles.memberContainer}>
                            <div className={styles.memberProfilePics}>
                                <img src={memberProfiles[email]} alt='Profile' />
                            </div>
                            <h1>{name}</h1>
                            
                        </div>
                    ))}
                  </div>

              </div>

            </div>


            <div className={styles.dimensionParentFlex}>
                <DimensionTeaser dimension={'HowTo'} bgUrl={'/images/fuzzy_blue.jpeg'} bgColor={'#aeb7fe'}/>
                <DimensionTeaser dimension={'Economic'} bgUrl={'/images/fuzzy_green.jpeg'} bgColor={'#7282fd'} />
                <DimensionTeaser dimension={'Individual'} bgUrl={'/images/fuzzy_orange.jpeg'} bgColor={'#d8beeb'}/>
            </div>
            <div className={styles.dimensionParentFlex}>
                <DimensionTeaser dimension={'Environmental'} bgUrl={'/images/fuzzy_pink.jpeg'} bgColor={'#ba8edd'}/>
                <DimensionTeaser dimension={'Social'} bgUrl={'/images/fuzzy_blue.jpeg'} bgColor={'#835ffe'}/>
                <DimensionTeaser dimension={'Technical'} bgUrl={'/images/fuzzy_green.jpeg'} bgColor={'#aeb7fe'}/>
            </div>
            <div className={styles.dimensionParentFlex}>
                <DimensionTeaser dimension={'SCI'} bgUrl={'/images/fuzzy_orange.jpeg'} bgColor={'#835ffe'}/>
                <DimensionTeaser dimension={'GHG'} bgUrl={'/images/fuzzy_blue.jpeg'} bgColor={'#3c2198'}/>
                <div style={{flex:0.333, margin: '20px', pointerEvents:'none'}}></div>
            </div>
        </div>
    </div>
  )
}