import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionTeaser from './dimensionTeaser';
import Header from './Header';

 
export default function Dashboard() {
    const [dashboardInfo, setDashboardInfo] = useState({Team:'', Lead:'', Organisation:'', Progress:'', ReportDue:'', Members:[], reportNo:''})
    const [progress, setProgress] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [expandReports, setExpandReports] = useState({todo:false, done:false})

    const user = auth.currentUser;

    const checkProgress = async () => {
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);

        let tempTodo = 0;
        let tempDone = 0;
        
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
                setTodoList(tempTodo);
                setDoneList(tempDone);

                //setProgress(Math.round((counter/6)*100));
            }
        } else {
            console.log("No such document!");
        }

        setProgress({todo:tempTodo, done:tempDone});
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
        const teamRef = userSnap.data().Team

        if (userSnap.exists()) {
            const teamRef = userSnap.data().Team;
            setProgress(userSnap.data().progress);
        } else {
            console.log("No such document!");
        }

        const teamSnap = await getDoc(teamRef);

        if (teamSnap.exists()) {
            setDashboardInfo({
                Team:teamSnap.data().name,
                Lead:teamSnap.data().coach,
                Organisation:teamSnap.data().org,
                Members: teamSnap.data().Members || [],
                ReportNo: teamSnap.data().CurrentReport.number,
            })
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        checkTeam();
        checkProgress();
    }, []);

    const headerText = `${dashboardInfo.Team} Dashboard`

  return (
    <div>
        <Header title={headerText} />
        <div className={styles.dashboardContent}>
            <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
            <div className={styles.dashboardInfo}>
                <div style={{flex: 0.4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <p>You are on report:</p>
                    <h1>{dashboardInfo.ReportNo}</h1>
                </div>
                <div style={{flex: 0.6, display: 'flex', flexDirection:'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding:'3vh'}}>
                    <div style={{display:'block', marginBottom:'1vh'}}>
                        <p>Reports completed: <b>{doneList.length}</b></p>
                        <button onClick={()=>expand('done')} className={styles.expandBtn}>{expandReports.done ? '↑' : '↓'}</button>
                        <div style={{display: expandReports.done ? 'block' : 'none', marginLeft:'2vw', marginTop:'0.5vw'}}>
                            {doneList.map((item, index) => (
                                <p key={index} style={{display:'inline', fontSize:'calc(12px + 0.4vw)', color:'#444444'}}>
                                   {index===doneList.length-1 ? item : item + ', '}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div style={{display:'block'}}>
                        <p>Reports to complete: <b>{todoList.length}</b></p>
                        <button onClick={()=>expand('todo')} className={styles.expandBtn}>&darr;</button>
                        <div style={{display: expandReports.todo ? 'block' : 'none', marginLeft:'2vw', marginTop:'0.5vw'}}>
                            {todoList.map((item, index) => (
                                <p key={index} style={{display:'inline', fontSize:'calc(12px + 0.4vw)', color:'#444444'}}>
                                   {index===todoList.length-1 ? item : item + ', '}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.membersInfo}>
                <h1>Members</h1>
                <p><b>Team Lead: </b></p>
                <p style={{paddingLeft:'0.8vw'}}>{dashboardInfo.Lead}</p>
                <p><b>Developers: </b></p>
                {dashboardInfo.Members.map((member) => (
                    <p style={{paddingLeft:'0.8vw'}}>{member}</p>
                ))}
            </div>
            </div>


            <div className={styles.dimensionParentFlex}>
                <DimensionTeaser dimension={'HowTo'} bgUrl={'/images/fuzzy_blue.jpeg'} bgColor={'#aeb7fe'}/>
                <DimensionTeaser dimension={'Economic'} bgUrl={'/images/fuzzy_green.jpeg'} bgColor={'#7282fd'} />
                <DimensionTeaser dimension={'Individual'} bgUrl={'/images/fuzzy_orange.jpeg'} bgColor={'#d8beeb'}/>
                <DimensionTeaser dimension={'Environmental'} bgUrl={'/images/fuzzy_pink.jpeg'} bgColor={'#ba8edd'}/>
                <DimensionTeaser dimension={'Social'} bgUrl={'/images/fuzzy_blue.jpeg'} bgColor={'#835ffe'}/>
                <DimensionTeaser dimension={'Technical'} bgUrl={'/images/fuzzy_green.jpeg'} bgColor={'#aeb7fe'}/>
                <DimensionTeaser dimension={'SCI'} bgUrl={'/images/fuzzy_orange.jpeg'} bgColor={'#835ffe'}/>
                <DimensionTeaser dimension={'GHG'} bgUrl={'/images/fuzzy_blue.jpeg'} bgColor={'#3c2198'}/>
            </div>

        </div>
    </div>
  )
}