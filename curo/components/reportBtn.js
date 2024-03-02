import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Reports.module.css';
import infoStyles from '../styles/Info.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router'
 
const ReportBtn = ({ dimension, reportDone }) => {
  const router = useRouter();

  const handleClick = () => {
    console.log(`Button clicked for ${dimension}`);
    router.push(`/report-pages/${dimension}Report`);
  };
  
  return (
    <button 
      className={infoStyles.navElts}
      style={{
        pointerEvents: reportDone ? 'none' : 'auto',
        opacity: reportDone ? '0.5' : '1'
      }}
      onClick={handleClick}>
        Start report &rarr;
    </button>
  );
};
  
export default ReportBtn;