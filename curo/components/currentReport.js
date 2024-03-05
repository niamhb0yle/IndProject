import Link from 'next/link';
import Head from 'next/head';
import infoStyles from '../styles/Info.module.css';
import reportStyles from '../styles/Reports.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { useRouter } from 'next/router';

Modal.setAppElement('#__next'); // lets the DOM know how to manage focus with modal

const fetchReports = async (teamRef, reportNumber) => {
  const quantitativeCategories = ['SocialQuant', 'EconomicQuant', 'TechnicalQuant', 'IndividualQuant', 'EnvironmentalQuant'];
  const qualitativeCategories = ['SocialQual', 'EconomicQual', 'TechnicalQual', 'IndividualQual', 'EnvironmentalQual'];

  const reports = {
    quantitative: quantitativeCategories.reduce((acc, category) => ({ ...acc, [category]: [] }), {}),
    qualitative: qualitativeCategories.reduce((acc, category) => ({ ...acc, [category]: {} }), {})
  };

  const teamSnap = await getDoc(teamRef);
  if (!teamSnap.exists()) {
    console.log('Team document not found');
    return reports;
  }

  const memberIds = teamSnap.data().Members || [];
  await Promise.all(
    memberIds.map(async (memberId) => {
      const reportRef = doc(db, `Users/${memberId}/Reports`, reportNumber);
      const reportSnap = await getDoc(reportRef);
      if (reportSnap.exists()) {
        const data = reportSnap.data();
        quantitativeCategories.forEach((category) => {
          if (data[category]) {
            reports.quantitative[category].push(data[category]);
          }
        });
        qualitativeCategories.forEach((category) => {
          if (data[category]) {
            Object.keys(data[category]).forEach((question) => {
              reports.qualitative[category][question] = reports.qualitative[category][question] || [];
              reports.qualitative[category][question].push(data[category][question]);
            });
          }
        });
      }
    })
  );

  return reports;
};

// Calculate mean values for quantitative data and aggregate qualitative responses
const processReports = (reports) => {
  const results = {
    quantitativeMeans: {},
    qualitativeResponses: reports.qualitative
  };

  Object.keys(reports.quantitative).forEach((category) => {
    const categoryData = reports.quantitative[category];
    const summary = {};
    categoryData.forEach((response) => {
      Object.keys(response).forEach((question) => {
        summary[question] = (summary[question] || 0) + response[question];
      });
    });
    const means = {};
    Object.keys(summary).forEach((question) => {
      means[question] = parseFloat((summary[question] / categoryData.length).toFixed(2));
    });
    results.quantitativeMeans[category] = means;
  });

  return results;
};

const uploadReportDataToFirestore = async (teamId, reportNumber, processedData, memberCount) => {
  const firestoreData = {};

  Object.entries(processedData.quantitativeMeans).forEach(([category, values]) => {
    firestoreData[`${category}`] = values;
  });

  Object.entries(processedData.qualitativeResponses).forEach(([category, responses]) => {
    firestoreData[`${category}`] = responses;
  });
  
  const reportRef = doc(db, `Teams/${teamId}/Reports/${reportNumber}`);

  try {
    await updateDoc(reportRef, firestoreData);
    await updateDoc(reportRef, {
      memberCount: memberCount
    });
    console.log('Report data successfully uploaded to Firestore.');
  } catch (error) {
    console.error('Error uploading report data to Firestore:', error);
  }
}; 

const updateCurrentReport = async (teamId, reportNumber, nextDueDate) => {
  const teamRef = doc(db, "Teams", teamId);
  const teamSnap = await getDoc(teamRef);

  // update teams 'CurrentReport' status with:
  // new due date (from params)
  // start date (taken from old report)
  let oldDueDate = teamSnap.data().CurrentReport.due;
  // new report number
  let newReportNumber = parseInt(reportNumber, 10) + 1;

  // access current report and update:
  await updateDoc(teamRef, {
    CurrentReport: {
      due: nextDueDate,
      number: newReportNumber,
      start: oldDueDate
    }
  })

  // initialise the new 'report' doc for this report
  const newReportCollectionRef = doc(db, `Teams/${teamId}/Reports/${newReportNumber}`);
  await setDoc(newReportCollectionRef, {
    due: nextDueDate,
    number: newReportNumber,
    start: oldDueDate
  })
}

const resetMembersProgress = async (memberIds, reportNumber) => {

  await Promise.all(
    memberIds.map(async (memberId) => {
      const userRef = doc(db, `Users/${memberId}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().progress) {
        const currentProgress = userSnap.data().progress;
        let newReportNumber = parseInt(reportNumber, 10) + 1;
        
        const resetProgress = Object.keys(currentProgress).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});

        await updateDoc(userRef, {
          progress: resetProgress
        });

        // Initilise new report doc for this user
        const newUserReportCollectionRef = doc(db, `Users/${memberId}/Reports/${newReportNumber}`);
        await setDoc(newUserReportCollectionRef, {
          number: newReportNumber
        })
      }
    })
  );
}

export default function CurrentReport() {
  const user = auth.currentUser;
  const [userType, setUserType] = useState('');
  const [reportNumber, setReportNumber] = useState('');
  const [dates, setDates] = useState({start:'', due:''});
  const [progress, setProgress] = useState('Complete');
  const [incompleteMembers, setIncompleteMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nextDueDate, setNextDueDate] = useState('');
  const [teamRef, setTeamRef] = useState();
  const [memberIds, setMemberIds] = useState([]);
  const router = useRouter();

  const getData = async () => {
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
    const tempTeamRef = userSnap.data().Team;
    setTeamRef(tempTeamRef);
    const teamSnap = await getDoc(tempTeamRef);
    const start = teamSnap.data().CurrentReport.start.toDate();
    const due = teamSnap.data().CurrentReport.due.toDate();
    setDates({start: start.toLocaleDateString(), due: due.toLocaleDateString()});
    const reportNumberLocal = String(teamSnap.data().CurrentReport.number);
    const reportRef = doc(db, `Teams/${teamSnap.id}/Reports/${reportNumberLocal}`);
    setReportNumber(reportNumberLocal);
    const reportSnap = await getDoc(reportRef);
    setIncompleteMembers([]);
  
    const members = teamSnap.data().Members || [];
    setMemberIds(members);

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
    const date = new Date(nextDueDate + 'T00:00:00');
    let reports = {};
    setShowModal(false);

    reports = await fetchReports(teamRef, reportNumber)
    const processedData = await processReports(reports);
    await uploadReportDataToFirestore(teamRef.id, reportNumber, processedData, memberIds.length);
    await updateCurrentReport(teamRef.id, reportNumber, date);
    await resetMembersProgress(memberIds, reportNumber);
    router.push('./dashboard');
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
      borderRadius: '30px',
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
            <button className={reportStyles.finishReportBtn}
            onClick={handleFinishReport} 
              style={{
              pointerEvents: userType === "lead" && progress === "Complete" ? 'auto' : 'none',
              opacity: userType === "lead" && progress === "Complete" ? '1' : '0.5',
              display:'block'
            }}
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

