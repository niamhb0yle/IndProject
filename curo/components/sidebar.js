import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

 
export default function SideBar() {
  return (
    <div className={styles.sidebarContainer}>
      <div id={styles.sidebarLogo}>C</div>
      <div className={styles.sidebarNav}>
        <Link id={styles.sidebarNavElements} href='/homepage'>
          <img src='/images/teamsIcon.png' alt='teams icon' width='40px'/>
        </Link>
        <Link id={styles.sidebarNavElements} href='/homepage'>Profile</Link>
        <Link id={styles.sidebarNavElements} href='/homepage'>
          <img src='/images/settingsIcon.png' alt='settings icon' width='40px'/>
        </Link>
      </div>
    </div>
  )
}2