import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Header.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

export default function Header( {title} ) {
    return (
      <div className={styles.header}>
        <div id={styles.headerTitle}>{title}</div>
        <div className={styles.headerElts}>
          <Link href='/header/profile'>
            <img src='/images/user.png' alt='user icon' width='50px' height='50px' id={styles.headerElements}/>
          </Link>
          <Link href='/header/settings'>
            <img src='/images/settings.png' alt='settings icon' width='50px' height='50px' id={styles.headerElements}/>
          </Link>
        </div>
      </div>
    );
  }
  