import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Header.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Header( {title} ) {
  const [profilePic, setProfilePic] = useState('/images/user.png');
  const [username, setUsername] = useState('');

  const getProfilePic = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.email);
    const userSnap = await getDoc(userRef);
    if (userSnap.data().photoUrl) {
      setProfilePic(userSnap.data().photoUrl);
      console.log("photoUrl exists")
    }
    setUsername(userSnap.data().username);
  };

  useEffect(() => {
    getProfilePic();
  }, []);

  
    return (
      <div className={styles.header}>
        <div id={styles.headerTitle}>{title}</div>
        <div className={styles.headerElts}>
          <div className={styles.helloText}>
            <p>Hey,  {username}!</p>
          </div>
          <Link href='/header/profile'>
            <div className={styles.headerElements}>
              <img src={profilePic} alt='Profile'/>
            </div>
          </Link>
        </div>
      </div>
    );
  }
  