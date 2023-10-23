import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat"; 


export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secondPword: ""
  });

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

        <label htmlFor="#name">Email address</label>
            <input className={`${styles.input}`}
              placeholder="Email address"
              type={"text"}
              id="email"
              name="email"
            />

        <label htmlFor="#name">Display name</label>
            <input className={`${styles.input}`}
              placeholder="Display name"
              type={"text"}
              id="name"
              name="name"
            />


        <label htmlFor="#address">Password</label>
        <input className={`${styles.input}`}
          placeholder="Password"
          type={"text"}
          id="password" 
          name="password"
        />

        <label htmlFor="#address">Confirm Password</label>
        <input className={`${styles.input}`}
          placeholder="Confirm Password"
          type={"text"}
          id="password2"
          name="password2"
        />

        
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

