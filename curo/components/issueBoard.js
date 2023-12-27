import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

/*
text-decoration: none;
  text-align: left;
  font-family: 'Montserrat';
  font-weight: 700;
  font-size: 35px;
  color: #FFFFFF;
  display:"block";
  margin: 10px;
*/

export default function IssueBoard() {
  return (
    <div style={{display:'flex', flex: 1, flexDirection: 'row', flexWrap:'wrap', alignContent:'flex-start'}}>
        <div style={{width: 400, minHeight:600, background:'#d2cccc', marginRight:30, borderRadius:20, display:'flex', flex:1, alignItems:'center', flexDirection:'column', justifyContent:'flex-start', borderLeft:10, borderTop:10}}>
            <p style={{fontSize:25, fontFamily:'Manrope', fontWeight:1000, color: 'black'}}>To do:</p>  
            <div style={{width:350, height:100, background:'linear-gradient(180deg, white 0%, white 60%, #8ae5c9 60%, #8ae5c9 100%)', borderRadius:20, marginBottom: 8, border:10}}><p>issue 1</p></div>
            <div style={{width:350, height:100, background:'#8ae5c9', borderRadius:20, marginBottom: 8}}>issue 2</div>
            <div style={{width:350, height:100, background:'#8ae5c9', borderRadius:20, marginBottom: 8}}>issue 3</div>
            <div style={{width:350, height:100, background:'#8ae5c9', borderRadius:20, marginBottom: 8}}>issue 4</div>
        </div>
        <div style={{width: 400, minHeight:600, background:'#d2cccc', marginRight:30, borderRadius:20, display:'flex', flex:1, justifyContent:'center', border:5}}>
            <p style={{fontSize:25, fontFamily:'Manrope', fontWeight:1000, color: 'black'}}>In progress:</p>
        </div>
        <div style={{width: 400, minHeight:600, background:'#d2cccc', marginRight:30, borderRadius:20, display:'flex', flex:1, justifyContent:'center', border:5}}>
            <p style={{fontSize:25, fontFamily:'Manrope', fontWeight:1000, color: 'black'}}>Complete:</p>
        </div>

    </div>
  )
}
