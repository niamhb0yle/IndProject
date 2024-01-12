import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

export default function Header( {title} ) {
    return (
      <div className={styles.header}>
        <div id={styles.headerTitle}>{title}</div>
        <div className={styles.headerElts}>
          <p id={styles.headerElements}>Hey, Niamh B!</p>
          <Link id={styles.headerElements} href='/header/profile'>
            <img src='/images/user.png' alt='settings icon' width='55px'/>
          </Link>
          <Link id={styles.headerElements} href='/header/settings'>
            <img src='/images/engineer.png' alt='settings icon' width='55px'/>
          </Link>
        </div>
      </div>
    );
  }
  