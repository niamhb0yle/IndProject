import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';
import {useState} from 'react';
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'

export default function LogIn() {
  const [userProfile, setUserProfile] = useState({email:'', password:''});
  const router = useRouter();

  async function loginHandler(){
    signInWithEmailAndPassword(auth, userProfile.email, userProfile.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        router.push('/homepage');
      });
  };

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

          <div className={styles.inputText}>Email Address</div>
          <input value={userProfile.email} 
            onChange={(e) => setUserProfile({...userProfile, email:e.target.value})} 
            style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='email'>
          </input>

          <div className={styles.inputText}>Password</div>
          <input value={userProfile.password} 
            onChange={(e) => setUserProfile({...userProfile, password:e.target.value})} 
            style={{width: '100%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='password'>
          </input>

          <div style={{display:'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop:'50px'}}>
            <button onClick={loginHandler} className={styles.loginButton}>Submit</button>
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

