import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import settingsStyles from '../../styles/Settings.module.css';
import dashboardStyles from '../../styles/Dashboard.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import DimensionTeaser from '../../components/dimensionTeaser';
import Header from '../../components/Header';
import SideBar from '../../components/sidebar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function HowTo() {
  const [dashboardInfo, setDashboardInfo] = useState({Team:'', Lead:'', Organisation:'', Progress:'', ReportDue:'', Members:[], reportNo:''})
    const [progress, setProgress] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [expandReports, setExpandReports] = useState({todo:false, done:false})

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
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.mainContainer}>
          <SideBar/>

          <div className={dashboardStyles.dashboard}>
            <Header title="How it works..."/>

            <div className={dashboardStyles.dashboardContent}>
              
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

