import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import {useState} from 'react';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router'
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, arrayRemove } from 'firebase/firestore';


export default function LogIn() {
  const [userProfile, setUserProfile] = useState({email:'', password:''});
  const [credentials, setCredentials] = useState(true);
  const router = useRouter();

  function loginHandler(){
    signInWithEmailAndPassword(auth, userProfile.email, userProfile.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        checkUserTeam();
      }).catch((error) => {
        setCredentials(false);
      });
  };

  const checkUserTeam = async () => {
    const userRef = doc(db, "Users", userProfile.email);
    const userSnap = await getDoc(userRef);
    if (userSnap.data().Team != '') {
      router.push('/sidebar/dashboard');
    } else {
      router.push('/noTeam');
    }
  }

  const goBack = () => {
    router.push('/');
  }

  function handleSubmit(e){
    e.preventDefaullt()
   };

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <div id={styles.loginContainer}>
          <div id={styles.loginHeader}>Log in</div>

          <p hidden={credentials} className={styles.signupInstructions} >We can't find your account. Please try again</p>

          <div className={styles.inputText}>Email Address</div>
          <input value={userProfile.email} 
            onChange={(e) => setUserProfile({...userProfile, email:e.target.value.toLowerCase()})} 
            style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            >
          </input>

          <div className={styles.inputText}>Password</div>
          <input value={userProfile.password} 
            onChange={(e) => setUserProfile({...userProfile, password:e.target.value})} 
            style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='password'>
          </input>

          <div style={{display:'flex', flexWrap: 'wrap', flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop:'50px'}}>
            <button onClick={loginHandler} className={styles.loginButton}>Submit</button>
            <button onClick={goBack} className={styles.loginButton}>Go back</button>
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

