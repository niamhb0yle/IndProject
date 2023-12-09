import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';
 
export default function Dashboard() {
  return (
    <div className={styles.dashboardContent}>
        <p>Here is a description of the team, with an introduction to their work. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <div className={styles.dimensionParentFlex}>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background:'#F6866A'}}>Technical</Link>
            <Link href='/dimension-pages/environmental' className={styles.dimensionTeaser} style={{background:'#7661E2'}}></Link>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background:'#FABE7A'}}></Link>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background:'#D8F4B4'}}></Link>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background:'#9DC1F8'}}></Link>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background:'#F6866A'}}></Link>
            <Link href='/dimension-pages/technical' className={styles.dimensionTeaser} style={{background:'#F6866A'}}></Link>
        </div>

    </div>
  )
}