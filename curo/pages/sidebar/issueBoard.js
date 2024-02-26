import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import ibStyles from '../../styles/IssueBoard.module.css';
import settingsStyles from '../../styles/Settings.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import IssueBoard from '../../components/issueBoard';
import AddIssue from '../../components/addIssue';
import {useState, useEffect} from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

const fetchIssues = async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.email);
  const userSnap = await getDoc(userRef);
  const teamRef = userSnap.data().Team
  const issuesRef = collection(teamRef, "Issues");

  const q = query(issuesRef, where('Status', 'in', ['To Do', 'In Progress', 'Complete']));
  const querySnapshot = await getDocs(q);
  let issues = { 'To Do': [], 'In Progress': [], 'Complete': [] };

  querySnapshot.forEach((doc) => {
    const issueData = doc.data();
    issues[issueData.Status].push({
      title: issueData.Title,
      assignee: issueData.Assignee,
      description: issueData.Description,
      storyPoints: issueData.StoryPoints,
      id: doc.id,
    });
  });

  console.log(issues)
  return issues;
};

export default function Homepage() {
  const [issues, setIssues] = useState({ 'To Do': [], 'In Progress': [], 'Complete': [] });

  useEffect(() => {
    fetchIssues().then(setIssues);
  }, []);

  const handleIssueAdded = () => {
    fetchIssues().then(setIssues);
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
            <Header title="Issue Board"/>

            <div className={styles.dashboardContent}>
              <div className={ibStyles.issueInfoContainer}>
                <div style={{flex:0.5}}>
                  <p>Use this kanban board to keep on top of your Sustainability goals, big or small. Create your own issue, or select an issue from our suggestions!</p>
                </div>
                <div className={ibStyles.vl}></div>
                <div style={{flex:0.25}}>
                  <AddIssue onIssueAdded={handleIssueAdded} type='createIssue'/>
                </div>
                <div style={{flex:0.25}}>
                  <AddIssue onIssueAdded={handleIssueAdded} type='fromSuggestions'/>
                </div>
              </div>
              <IssueBoard issues={issues} setIssues={setIssues}/>
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

