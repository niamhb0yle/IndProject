import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import SideBar from '../../components/sidebar';
import Header from '../../components/Header';
import ReportBtn from '../../components/reportBtn';
import Likert from 'react-likert-scale';

export default function Ecconomic() {

    const likertOptions = {
        responses: [
            { value: 1, text: "Abysmal" },
            { value: 2, text: "Poor" },
            { value: 3, text: "Average", checked: true },
            { value: 4, text: "Good" },
            { value: 5, text: "Excellent" }
        ],
        onChange: val => {
            console.log(val);
        }
    };

  return (
    <div>
      <Head>
        <title>Curo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.mainContainer}>
          <SideBar/>

          <div className={styles.dashboard}>
            <Header title="Economic"/>
            
            <div className={styles.dashboardContent}>
                <div style={{background:'#F8F8F8', width:'100%', height:'fit-content', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)', borderRadius:30, padding:30}}>
                    <div>
                        <p style={{fontSize:18}}>1. The team met the sprint's defined goals and objectives within the allocated budget</p>
                        <Likert {...likertOptions} />
                    </div>
                    <p>2. Initiatives were in place to ensure job security for team members</p>
                    <p>3. There were professional development opportunities for the team members</p>
                    <p>4. The team supports learning and career advancement for team members</p>
                    <p>5. Compensation structures within the team were fair</p>
                    <p>6. The project positively contributed to economic growth in its community or industry</p>
                    <p>7. The team actively sought ways to contribute to the economic wellbeing of stakeholders</p> 
                    <p>8. Efforts were made to minimize the environmental impact of the project's infrastructure</p>
                    <p>9. The team invested in innovative technologies or practices to improve efficiency</p>
                    <p>10. Innovation was a priority in project planning and execution</p> 
                    <p>11. The team actively engages in activities that enhance the competitiveness of the industry</p>    
                    <p>12. Resources, including time and personnel, were allocated efficiently throughout the project</p> 
                    <p>13. The team conducted cost-benefit analyses for major project decisions</p> 
                    <p>14. The team prioritizes activities with a positive cost-benefit ratio</p>     
                    <p>15. Decisions were made with a focus on maximizing the project's economic benefits</p>
                </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        main {
          padding: 2rem 0;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

