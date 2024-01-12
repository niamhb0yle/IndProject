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
          <Link id={styles.headerElements} href='/header/profile'>
            Profile
          </Link>
          <Link id={styles.headerElements} href='/header/settings'>
            Settings
          </Link>
        </div>
      </div>
    );
  }
  