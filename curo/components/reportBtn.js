import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

 
const ReportBtn = ({ dimension }) => {
    const handleClick = () => {
      // Your logic for what happens when the button is clicked
      console.log(`Button clicked for ${dimension}`);
      // You can navigate, show a modal, or perform any other action here
    };
  
    return (
      <button className={styles.reportBtn} onClick={handleClick}>
        Complete report for {dimension} sustainability &rarr;
      </button>
    );
  };
  
export default ReportBtn;