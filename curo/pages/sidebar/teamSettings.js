import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import infoStyles from '../../styles/Info.module.css';
import reportStyles from '../../styles/Reports.module.css';
import settingsStyles from '../../styles/Settings.module.css';
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';


Modal.setAppElement('#__next'); // lets the DOM know how to manage focus with modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width:'500px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '30px',
  },
};


export default function TeamSettings() {
  const [teamInfo, setTeamInfo] = useState({name:'', lead:'', org:'', key:'', members:[], currentReport:{}});
  const [showModal, setShowModal] = useState(false);
  const [newTeamInfo, setNewTeamInfo] = useState({name:'', org:''});
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    setTeamData();
  }, []);

  useEffect(() => {
    let tempSubmit = true;
    if (newTeamInfo.name === '' && newTeamInfo.org === '') {
        tempSubmit = false;
    }
    setSubmit(tempSubmit);
  }, [newTeamInfo]);

  const setTeamData = async () => {
    const user = auth.getCurrentUser;
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team;
    const teamSnap = await getDoc(teamRef);

    let membersNames = {};
    let memberProfiles = {};

    await Promise.all(members.map(async (member) => {
      const memberRef = doc(db, "Users", member);
      const memberSnap = await getDoc(memberRef);
      membersNames[member] = memberSnap.data().username;
      if (memberSnap.data().photoUrl){
        memberProfiles[member] = memberSnap.data().photoUrl;
      } else {
        memberProfiles[member] = '/images/user.png';
      }
    }));

    await setMemberProfiles(memberProfiles);

    if (teamSnap.exists()) {
      setTeamInfo({
        Team:teamSnap.data().name,
        Lead:teamSnap.data().coach,
        Organisation:teamSnap.data().org,
        ReportNo: teamSnap.data().CurrentReport.number,
        Members: membersNames,
      })
    } else {
        console.log("No such document!");
    }
  }

  const handleEditTeam = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team;

    let newName = '';
    let newOrg = '';

    if (newTeamInfo.name === ''){
      newName = teamInfo.name;
    } else {
      newName = newTeamInfo.name;
    }

    if (newTeamInfo.org === ''){
      newOrg = teamInfo.org;
    } else {
      newOrg = newTeamInfo.org;
    }

    await updateDoc(teamRef, {
        name: newName,
        org: newOrg
    });

    await setShowModal(false);
    await setTeamData();
  }

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
            <Header title="Team Settings"/>

            <div className={styles.dashboardContent}>

              <div className={settingsStyles.settingsContainer} >
                <h1>Team info</h1>
                <div className={settingsStyles.settingsContentParent}>
                  <div style={{flex:0.4}}>    
                      <p><b>Team name:</b> {teamInfo.name}</p>
                      <p><b>Organisation:</b> {teamInfo.org}</p>
                      <p><b>Team Lead:</b> {teamInfo.lead}</p>
                      <button className={settingsStyles.settingsBtn} onClick={() => setShowModal(true)}>Edit team info</button>
                  </div>

                  <Modal
                    isOpen={showModal}
                    onRequestClose={() => setShowModal(false)}
                    style={customStyles}
                    contentLabel="Select Next Due Date"
                  >
                      <h1 className={reportStyles.headingText} style={{marginBottom:'0'}}>Edit team info</h1>
                      <p>Team name:</p>
                      <input
                          value={newTeamInfo.name}
                          onChange={(e) => setNewTeamInfo({...newTeamInfo, name:e.target.value})}
                          className={reportStyles.inputBoxes}
                          style={{width: '40%', display: 'inline'}}
                          type="text"
                          placeholder={teamInfo.name}
                      />
                      <p>Organisation:</p>
                      <input
                          value={newTeamInfo.org}
                          onChange={(e) => setNewTeamInfo({...newTeamInfo, org:e.target.value})}
                          className={reportStyles.inputBoxes}
                          style={{width: '40%', display: 'inline'}}
                          type="text"
                          placeholder={teamInfo.org}
                      />
                      <br></br>
                      <button 
                          className={infoStyles.reportPageBtn} 
                          style={{fontFamily:'Manrope', float:'right', marginLeft:0}} 
                          onClick={() => setShowModal(false)}>
                              Cancel
                      </button>
                      <button 
                          className={infoStyles.reportPageBtn} 
                          style={{
                              fontFamily:'Manrope', 
                              float:'right',
                              pointerEvents: submit ? 'auto' : 'none',
                              opacity: submit ? '1' : '0.5',
                          }} 
                          onClick={handleEditTeam}>
                              Make changes
                      </button>
                  </Modal>

                  <div style={{flex:0.4}}>
                    <p>Each team on Curo owns a private key which is given to team members to gain access.
                       Team members will need this key to join a group when creating their account.</p>
                    <p><b> Do not</b> distribute this key to people outwith {teamInfo.name}! Hover over the blurred key below to copy and send to team members:</p>
                    <div className={settingsStyles.specialKey}> {teamInfo.key}</div>
                  </div>
                </div>
                <hr style={{marginTop:'4vh'}}></hr>
                <h1>Members</h1>
                <p>Invite or remove team members here:</p>
                  <ul>
                  {
                    teamInfo.members.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))
                  }
                </ul>
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

