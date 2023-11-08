import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function SignUp() {
  const [role, setRole] = useState('');
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [userProfile, setUserProfile] = useState({email:'', username:'', password:'', confirmPassword:''})
  
  // Function to set the role and background color
  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  const onSubmit = async () => {
    // validation to see if passwords match up
    if (userProfile.password !== userProfile.confirmPassword) {
      setError("Passwords do not match");
    } else {
      try {
        var fieldName;
        if (role === 'dev'){
          fieldName = "Developers";
        } else {
          fieldName = "Leads";
        }

        // creating firebase auth account
        await createUserWithEmailAndPassword(auth, userProfile.email, userProfile.password)

        // creating firestore doc in correct field for coaches/leads
        setDoc(doc(db, fieldName, userProfile.email), {
          email: userProfile.email,
          username: userProfile.username,
        });
      
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };


  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.signupContainer}>

        <div id={styles.signupInputContainer}>
          <div id={styles.signupHeader}>Create Account</div>

          <div className={styles.inputText}>Email Address</div>
          <input value={userProfile.email} 
            onChange={(e) => setUserProfile({...userProfile, email:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} type='email'>
          </input>
          
          <div className={styles.inputText}>Display Name</div>
          <input value={userProfile.username} 
            onChange={(e) => setUserProfile({...userProfile, username:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='text'>
          </input>

          <div className={styles.inputText}>Password</div>
          <input value={userProfile.password} 
            onChange={(e) => setUserProfile({...userProfile, password:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='password'>
          </input>
          
          <div className={styles.inputText}>Confirm Password</div>
          <input value={userProfile.confirmPassword} 
            onChange={(e) => setUserProfile({...userProfile, confirmPassword:e.target.value})} 
            style={{width: '80%', height: 48, display:'block', borderRadius: 8, border: '1px #CDCDCD solid', marginTop:5, background: '#E8F1FF', fontSize: 16, fontFamily: 'Karla Variable', padding:10}} 
            type='password'>
          </input>

          <p className={styles.signupInstructions}>Please select your role: </p>

          <button
            text="Developer"
            className={styles.signupButton}
            onClick={() => handleRoleClick('dev')}
            style={{ background: role === 'dev' ? '#CEDCFA' : '#DBE9FF' }}
          >Developer</button>
          <button
            text="Scrum Master"
            className={styles.signupButton}
            onClick={() => handleRoleClick('sm')}
            style={{ background: role === 'sm' ? '#CEDCFA' : '#DBE9FF' }}
          >Scrum Master</button>
          <button
            text="Product Owner"
            className={styles.signupButton}
            onClick={() => handleRoleClick('po')}
            style={{ background: role === 'po' ? '#CEDCFA' : '#DBE9FF' }}
          >Product Owner</button>

          <div style={{textAlign: 'right', marginTop:'50px'}}>
            <Link onClick={onSubmit} href={role === 'dev' ? '/signupDev' : '/signupScrum'} className={styles.continue}>Continue &rarr;</Link>
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

