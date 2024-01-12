import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import { useRouter } from 'next/router';

/*
width: fit-content;;
  padding:15px;
  margin-inline-end: 10px;
  flex-shrink: 0;
  border-radius: 30px;
  background: #DBE9FF;
  border:none;
  color: #033988;
  font-family: 'Karla Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  display:inline-block;
  cursor:pointer;
*/

export default function IssueBoard() {
  return (
    <div style={{display:'flex', flex: 1, flexDirection: 'row', flexWrap:'wrap', alignContent:'flex-start'}}>
        <div style={{width: 400, minHeight:600, background:'#D9D9D9', marginRight:30, borderRadius:20, display:'flex', flex:1, alignItems:'center', flexDirection:'column', justifyContent:'flex-start', borderLeft:10, borderTop:10}}>
            <p style={{fontSize:25, fontFamily:'Manrope', fontWeight:1000, color: 'black'}}>To do:</p>  
            <div style={{width:350, height:'fit-content', background:'linear-gradient(180deg, white 0%, white 60%, #6AB4B9 60%, #6AB4B9 100%)', borderRadius:20, marginBottom: 18}}>
              <p style={{marginLeft:7, fontWeight:1000, fontSize:22}}>Issue 1 Title</p>
              <p style={{marginLeft:7, fontSize:15}}>Assignees: Person 1, Person 2</p>
            </div>
            <div style={{width:350, height:'fit-content', background:'linear-gradient(180deg, white 0%, white 60%, #1e868d 60%, #1e868d 100%)', borderRadius:20, marginBottom: 18}}>
              <p style={{marginLeft:7, fontWeight:1000, fontSize:22}}>Issue 2 Title</p>
              <p style={{marginLeft:7, fontSize:15}}>Assignees: Person 1, Person 2</p>
            </div>
            <div style={{width:350, height:'fit-content', background:'linear-gradient(180deg, white 0%, white 60%, #155e63 60%, #155e63 100%)', borderRadius:20, marginBottom: 18}}>
              <p style={{marginLeft:7, fontWeight:1000, fontSize:22}}>Issue 3 Title</p>
              <p style={{marginLeft:7, fontSize:15}}>Assignees: Person 1, Person 2</p>
            </div>
            <div><button style={{width:'fit-content', borderRadius:30, background:'transparent', fontSize:20}}>Add issue</button></div>
        </div>
        <div style={{width: 400, minHeight:600, background:'#D9D9D9', marginRight:30, borderRadius:20, display:'flex', flex:1, alignItems:'center', flexDirection:'column', justifyContent:'flex-start', borderLeft:10, borderTop:10}}>
            <p style={{fontSize:25, fontFamily:'Manrope', fontWeight:1000, color: 'black'}}>In progress:</p>
            <div style={{width:350, height:'fit-content', background:'linear-gradient(180deg, white 0%, white 60%, #6AB4B9 60%, #6AB4B9 100%)', borderRadius:20, marginBottom: 18}}>
              <p style={{marginLeft:7, fontWeight:1000, fontSize:22}}>Issue 1 Title</p>
              <p style={{marginLeft:7, fontSize:15}}>Assignees: Person 1, Person 2</p>
            </div>
        </div>
        <div style={{width: 400, minHeight:600, background:'#D9D9D9', marginRight:30, borderRadius:20, display:'flex', flex:1, alignItems:'center', flexDirection:'column', justifyContent:'flex-start', borderLeft:10, borderTop:10}}>
            <p style={{fontSize:25, fontFamily:'Manrope', fontWeight:1000, color: 'black'}}>Complete:</p>
            <div style={{width:350, height:'fit-content', background:'linear-gradient(180deg, white 0%, white 60%, #6AB4B9 60%, #6AB4B9 100%)', borderRadius:20, marginBottom: 18}}>
              <p style={{marginLeft:7, fontWeight:1000, fontSize:22}}>Issue 1 Title</p>
              <p style={{marginLeft:7, fontSize:15}}>Assignees: Person 1, Person 2</p>
            </div>
            <div style={{width:350, height:'fit-content', background:'linear-gradient(180deg, white 0%, white 60%, #1e868d 60%, #1e868d 100%)', borderRadius:20, marginBottom: 18}}>
              <p style={{marginLeft:7, fontWeight:1000, fontSize:22}}>Issue 2 Title</p>
              <p style={{marginLeft:7, fontSize:15}}>Assignees: Person 1, Person 2</p>
            </div>
        </div>

    </div>
  )
}
