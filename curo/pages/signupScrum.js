import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import { useState } from 'react';
import { db, auth } from "../firebase";
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function SignUpScrum() {
  const [teamInfo, setTeamInfo] = useState({teamName:'', org:''});
  const [formView, setFormView] = useState("details");
  const [startDate, setStartDate] = useState(new Date());
  const user = auth.currentUser;

  const addTeam = async () => {
    // creating team on firestore
    const docRef = await addDoc(collection(db, "Teams"), {
      name: teamInfo.teamName,
      org: teamInfo.org,
      coach: user.email,
    });

    const coachRef = doc(db, "Users", user.email);

    // adding link to team on firestore
    await updateDoc(coachRef, {
      Teams: arrayUnion(docRef.id)
    });
  }
  
  
  // Function to set the role and background color
  const handleDetails = () => {
    setFormView("datepicker");
  };

  console.log("signup scrum " + auth.currentUser);


  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.signupContainer}>

        <div id={styles.signupInputContainer}>
          <div id={styles.signupHeader}>Create Team</div>

          <div style={{display: formView === "details" ? "block" : "none"}}>
            <p className={styles.signupInstructions}>Create a team to get started...</p>

            <div className={styles.inputText}>Team name</div>
            <input 
              onChange={(e) => setTeamInfo({...teamInfo, teamName:e.target.value})} 
              style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
              type='email'>
            </input>

            <div className={styles.inputText}>Organisation</div>
            <input 
              onChange={(e) => setTeamInfo({...teamInfo, org:e.target.value})} 
              style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
              type='text'>
            </input>
            
            <div style={{textAlign: 'right', marginTop:'50px'}}>
              <button onClick={handleDetails} className={styles.continue}>Continue &rarr;</button> 
            </div>
          </div>

          <div style={{display: formView === "datepicker" ? "block" : "none"}}>
            <p>To get started, please enter the date you would like to have <b>{teamInfo.teamName}'s</b> first Curo report completed by.</p>
            <p>This will be visible for the whole team, and can be changed later in your teams settings.</p>
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)} 
            />
          </div>

        </div>     
      </main>

      <style jsx>{`
        main {
          padding: 2rem 0;
          display: block;
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

