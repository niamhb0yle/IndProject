import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

export default function DashboardNav() {
    return (
        <div className={styles.dashboardHeader}>
            <Link id={styles.teamNavElements} href='/homepage'>Dashboard</Link>
            <Link id={styles.teamNavElements} href='/issueBoard'>Sustainable Goals</Link>
            <Link id={styles.teamNavElements} href='/reports'>Reports</Link>
            <Link id={styles.teamNavElements} href='/teamSettings'>Team Settings</Link>
        </div>
    )
  }