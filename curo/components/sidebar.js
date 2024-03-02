import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Sidebar.module.css';
import reportStyles from '../styles/Reports.module.css';
import infoStyles from '../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faListCheck, faGear, faGaugeHigh, faC, faSeedling, faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import {auth, db} from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';


Modal.setAppElement('#__next'); // lets the DOM know how to manage focus with modal
const customStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    height:'fit-content',
    transform: 'translate(-50%, -50%)',
    borderRadius: '30px',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default function SideBar() {
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState('');
  const router = useRouter();

  const getFirestoreData = async () => {
    const user = auth.currentUser
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    setUserType(userSnap.data().userType);
  }

  useEffect(() => {
    getFirestoreData();
  }, []);

  const handleLogoutClick = () => {
    setShowModal(true);
  }

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }

  return (
    <div className={styles.sidebarContainer}>
      <div id={styles.sidebarLogo}><FontAwesomeIcon icon={faC} style={{width:'4vw'}}/></div>
      <Link id={styles.sidebarNavElements} href='/sidebar/dashboard'>
        <FontAwesomeIcon icon={faGaugeHigh} style={{width:'18px'}}/> Dashboard
      </Link>
      <Link id={styles.sidebarNavElements} href='/sidebar/issueBoard'>
        <FontAwesomeIcon icon={faListCheck} style={{width:'18px'}}/>  Issue board
      </Link>
      <Link id={styles.sidebarNavElements} href='/sidebar/reports'>
        <FontAwesomeIcon icon={faFileLines} style={{width:'18px'}}/> Reports
      </Link>
      <Link id={styles.sidebarNavElements} href='/sidebar/teamSettings' hidden={userType!='lead'}>
        <FontAwesomeIcon icon={faGear} style={{width:'18px'}}/> Team Settings
      </Link>

      <div className={styles.logoutWrapper}>
        <div className={styles.logoutButton}>
          <div style={{color:'white'}} onClick={handleLogoutClick}>Log out <FontAwesomeIcon icon={faRightFromBracket} style={{width:'18px'}}/></div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={customStyles}
        contentLabel="Select Next Due Date"
      >
        <h1 className={reportStyles.headingText} style={{marginBottom:'0', display:'flex'}}>Are you sure you want to log out?</h1>
        <button 
          className={styles.modalButtons} 
          onClick={handleLogout}>
              Yes, log me out
        </button>
        <button 
          className={styles.modalButtons} 
          onClick={() => setShowModal(false)}>
              No, take me back
        </button>
      </Modal>
    </div>
  )
}