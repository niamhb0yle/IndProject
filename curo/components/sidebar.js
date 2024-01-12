import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
 
export default function SideBar() {
  return (
    <div className={styles.sidebarContainer}>
      <div id={styles.sidebarLogo}>C</div>
      <Link id={styles.sidebarNavElements} href='/dashboard'>
        <img src='/images/teamsIcon.png' alt='teams icon' width='40px'/>
      </Link>
      <Link id={styles.sidebarNavElements} href='/dashboard'>
        <img src='/images/teamsIcon.png' alt='teams icon' width='40px'/>
      </Link>
      <Link id={styles.sidebarNavElements} href='/dashboard'>
        <img src='/images/settingsIcon.png' alt='settings icon' width='40px'/>
      </Link>
    </div>
  )
}