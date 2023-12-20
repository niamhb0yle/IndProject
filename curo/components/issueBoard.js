import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

export default function IssueBoard() {
  return (
    <div style={{display:'flex', flex: 1, flexDirection: 'row', flexWrap:'wrap', alignContent:'flex-start'}}>
        <div style={{width: 400, minHeight:600, background:'#d2cccc', marginRight:30, borderRadius:20, display:'flex', flex:1, justifyContent:'center'}}>
            <p style={{fontSize:30, fontFamily:'Manrope', fontWeight:1000, color: 'black', marginTop:5}}>To do:</p>
        </div>
        <div style={{width: 400, minHeight:600, background:'#d2cccc', marginRight:30, borderRadius:20, display:'flex', flex:1, justifyContent:'center'}}>
            <p style={{fontSize:30, fontFamily:'Manrope', fontWeight:1000, color: 'black', marginTop:5}}>In progress:</p>
        </div>
        <div style={{width: 400, minHeight:600, background:'#d2cccc', marginRight:30, borderRadius:20, display:'flex', flex:1, justifyContent:'center'}}>
            <p style={{fontSize:30, fontFamily:'Manrope', fontWeight:1000, color: 'black', marginTop:5}}>Complete:</p>
        </div>

    </div>
  )
}
