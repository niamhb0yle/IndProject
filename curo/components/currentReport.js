import Link from 'next/link';
import Head from 'next/head';
import infoStyles from '../styles/Info.module.css';
import reportStyles from '../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // lets the DOM know how to manage focus with modal

export default function CurrentReport() {
  const user = auth.currentUser;
  const [userType, setUserType] = useState('');
  const [reportNumber, setReportNumber] = useState('');
  const [dates, setDates] = useState({start:'', due:''});
  const [progress, setProgress] = useState('Complete');
  const [incompleteMembers, setIncompleteMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nextDueDate, setNextDueDate] = useState(new Date());

  const getData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
    const teamRef = userSnap.data().Team;
    const teamSnap = await getDoc(teamRef);
    const start = teamSnap.data().CurrentReport.start.toDate();
    const due = teamSnap.data().CurrentReport.due.toDate();
    setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
    const reportNumberLocal = String(teamSnap.data().CurrentReport.number);
    const reportRef = doc(db, `Teams/${teamSnap.id}/Reports/${reportNumberLocal}`);
    setReportNumber(reportNumberLocal);
    const reportSnap = await getDoc(reportRef);
    setIncompleteMembers([]);
  
    const members = teamSnap.data().Members || [];

    // using Promise.all to wait for all member data to be fetched
    const memberProgresses = await Promise.all(members.map(async (member) => {
      const memberRef = doc(db, "Users", member);
      const memberSnap = await getDoc(memberRef);
      let tempComplete = true;
      const memberProgress = memberSnap.data().progress;
      Object.keys(memberProgress).forEach((key) => {
        if (memberProgress[key] === false) {
          tempComplete = false;
        }
      });
      return { member, tempComplete };
    }));
  
    memberProgresses.forEach((member) => {
      if (!member.tempComplete) {
        setProgress('Incomplete');
        setIncompleteMembers((prevMembers) => [...prevMembers, member.member]);
      }
    });
  }
  
  const handleFinishReport = () => {
    setShowModal(true);
  };

  const handleSubmitDueDate = async () => {
    console.log('Next due date:', nextDueDate);
    setShowModal(false);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width:'400px',
      transform: 'translate(-50%, -50%)',
    },
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className={infoStyles.reportViewContent}>
        <h1>Current Report</h1>
        <div style={{display:'flex', flex:1, flexDirection:'row', flexWrap:'wrap'}}>
          
          <div style={{display:'flex', minWidth:'fit-content', flex:0.3, flexDirection:'column', marginRight:'2vw'}}>
            <p>Report number: {reportNumber}</p>
            <p>Start date: {dates.start}</p>
            <p>Due: {dates.due}</p>
          </div>

          <div style={{display:'flex', minWidth:'fit-content', flex:0.3, flexDirection:'column', marginRight:'2vw'}}>
              <p>Report progress: {progress}</p>
              {incompleteMembers.length > 0 ? (
                <div>
                  <p>Members still to complete their reports:</p>
                  <div  style={{marginLeft:'1vw'}}>
                  {incompleteMembers.map((member, index) => (
                    <div key={index}>{member}</div>
                  ))}
                  </div>
                </div>
              ) : (
                <div>All members have completed their reports!</div>
              )}
          </div>

          <div style={{display:'flex', minWidth:'fit-content', flex:0.33,  marginRight:'2vw'}}>
            <button className={infoStyles.reportPageBtn}
            onClick={handleFinishReport} /*
              style={{
              pointerEvents: userType === "lead" && progress === "Complete" ? 'auto' : 'none',
              opacity: userType === "lead" && progress === "Complete" ? '1' : '0.5',
              display:'block'
            }} */
            >Finish report</button>
            <Modal
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              style={customStyles}
              contentLabel="Select Next Due Date"
            >
              <h1 className={reportStyles.headingText} style={{marginBottom:'0'}}>Due date for next report</h1>
              <p>Please select a due date for your teams next report before we compile your current one!</p>
              <input type="date" style={{fontFamily:'Manrope', justifySelf:'center'}} value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
              <button className={infoStyles.reportPageBtn} style={{float:'right'}} onClick={handleSubmitDueDate}>Submit</button>
            </Modal>
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

