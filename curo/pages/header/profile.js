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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";


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


export default function Homepage() {
  const [userInfo, setUserInfo] = useState({name:'', lead:'', org:'', key:'', members:[], currentReport:{}});
  const [showModal, setShowModal] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState({name:'', org:''});
  const [submit, setSubmit] = useState(false);
  const [profilePic, setProfilePic] = useState('/images/user.png');

  useEffect(() => {
    setUserData();
  }, []);

  useEffect(() => {
    let tempSubmit = true;
    if (newUserInfo.name === '') {
        tempSubmit = false;
    }
    setSubmit(tempSubmit);
  }, [newUserInfo]);

  const setUserData = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    const teamRef = userSnap.data().Team;
    const teamSnap = await getDoc(teamRef);

    // profile pic stuff
    if (userSnap.data().photoUrl) {
      setProfilePic(userSnap.data().photoUrl);
      console.log("photoUrl exists")
    }

    let role = '';
    if (userSnap.data().userType === 'dev'){
      role = 'Developer';
    } else {
      role = 'Team Lead';
    }

    setUserInfo({
      email: userSnap.data().email,
      name: userSnap.data().username,
      team: teamSnap.data().name,
      lead: teamSnap.data().coach,
      org: teamSnap.data().org,
      type: role
    });

  }

  const handleEditUser = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.email);

    let newName = '';
    let newPassword = '';

    if (newUserInfo.name === ''){
      newName = userInfo.name;
    } else {
      newName = newUserInfo.name;
    }

    if (newUserInfo.org === ''){
      newOrg = userInfo.org;
    } else {
      newOrg = newUserInfo.org;
    }

    await updateDoc(userRef, {
        name: newName
    });

    await setShowModal(false);
    await setUserData();
  }

  // Profile pic code
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const storage = getStorage();
    const fileExtension = file.name.split('.').pop();
    const storageRef = ref(storage, `profilePics/${auth.currentUser.email}`);

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
  
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        const userRef = doc(db, "Users", auth.currentUser.email);
        updateDoc(userRef, { photoUrl: downloadURL }).then(() => {
          console.log("Document successfully updated with photoUrl!");
          setUserData();
        }).catch((error) => {
          console.error("Error updating document: ", error);
        });
      });
    });
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
            <Header title="Profile"/>

            <div className={styles.dashboardContent}>

              <div className={settingsStyles.settingsContainer} >
                
                <div className={settingsStyles.settingsContentParent} style={{padding:'2vw'}}>

                  <div style={{marginLeft:'2vw', marginRight: '2vw', flex:0.3, display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div className={settingsStyles.profilePicContainer}>
                      <img src={profilePic} alt='Profile'/>
                    </div>
                    <h1>{userInfo.name}</h1>
                    <p style={{marginTop:'0px'}}>{userInfo.type} at {userInfo.org}</p>
                      
                  </div>
                  <Modal
                    isOpen={showModal}
                    onRequestClose={() => setShowModal(false)}
                    style={customStyles}
                    contentLabel="Select Next Due Date"
                  >
                      <h1 className={reportStyles.headingText} style={{marginBottom:'0'}}>Change User Info</h1>
                      <p>Please leave any fields you do not wish to change blank!</p>
                      <p>Display Name:</p>
                      <input
                          value={newUserInfo.name}
                          onChange={(e) => setNewUserInfo({...newUserInfo, name:e.target.value})}
                          className={reportStyles.inputBoxes}
                          style={{width: '40%', display: 'inline'}}
                          type="text"
                          placeholder={userInfo.name}
                      />
                      <p>Change profile picture:</p>
                      <input type="file" onChange={handleFileChange} />
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
                          onClick={handleEditUser}>
                              Make changes
                      </button>
                  </Modal>

                  <div className={settingsStyles.vl}></div>

                  <div style={{flex:0.5, paddingTop:'2vh'}}>
                    <p><b>Email:</b> {userInfo.email}</p>
                      <p><b>Team:</b> {userInfo.team}</p>
                      <p><b>Organisation:</b> {userInfo.org}</p>
                      <p><b>Team Lead:</b> {userInfo.lead}</p>
                      <p><b>Role:</b> {userInfo.type}</p>
                      <button className={settingsStyles.settingsBtn} onClick={() => setShowModal(true)}>Edit team info</button>
                  </div>
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

