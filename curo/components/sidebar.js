import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Sidebar.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
 
export default function SideBar() {
  return (
    <div className={styles.sidebarContainer}>
      <div id={styles.sidebarLogo}>C</div>
      <Link id={styles.sidebarNavElements} href='/sidebar/dashboard'>
        Dashboard
      </Link>
      <Link id={styles.sidebarNavElements} href='/sidebar/issueBoard'>
        Issue board
      </Link>
      <Link id={styles.sidebarNavElements} href='/sidebar/reports'>
        Reports
      </Link>
      <Link id={styles.sidebarNavElements} href='/sidebar/teamSettings'>
        Settings
      </Link>
    </div>
  )
}