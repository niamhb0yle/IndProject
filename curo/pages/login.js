import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 
import '@fontsource-variable/karla';

export default function LogIn() {
  function handleSubmit(e){
    e.preventDefaullt()
   }

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>

        <div className="LogIn" style={{width: 1280, height: 832, position: 'relative'}}>
          <div className="LogIn" style={{left: 199, top: 208, position: 'absolute', color: '#0051CB', fontSize: 68, fontFamily: 'Montserrat', fontWeight: '600', letterSpacing: 2.04, wordWrap: 'break-word'}}>Log in</div>
          <div className="Group1" style={{width: 263, height: 61, left: 188, top: 538, position: 'absolute'}}>
          <div className="Rectangle2" style={{width: 263, height: 61, left: 0, top: 0, position: 'absolute', background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 30}} />
          <div className="ContinueWithGoogle" style={{left: 57, top: 21, position: 'absolute', color: 'black', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '600', letterSpacing: 0.48, wordWrap: 'break-word'}}>Continue with google</div>
        </div>
        <div className="EmailAddress" style={{width: 106, height: 21, left: 154, top: 327, position: 'absolute', color: 'rgba(0, 0, 0, 0.40)', fontSize: 16, fontFamily: 'Karla Variable', fontWeight: '400', wordWrap: 'break-word'}}>Email Address</div>
        <div className="Password" style={{width: 76, height: 18, left: 155, top: 420, position: 'absolute', color: 'rgba(0, 0, 0, 0.40)', fontSize: 16, fontFamily: 'Karla Variable', fontWeight: '400', wordWrap: 'break-word'}}>Password</div>
        <div className="Rectangle10" style={{width: 319, height: 48, left: 153, top: 354, position: 'absolute', borderRadius: 8, border: '1px #CDCDCD solid'}} />
        <div className="Rectangle11" style={{width: 317, height: 48, left: 155, top: 444, position: 'absolute', borderRadius: 8, border: '1px #CDCDCD solid'}} />
        <div className="PhEyeSlashDuotone" style={{width: 21, height: 21, left: 453, top: 457, position: 'absolute', transform: 'rotate(180deg)', transformOrigin: '0 0'}}>
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

