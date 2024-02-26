import Link from 'next/link';
import Head from 'next/head';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import Header from './Header';
import SideBar from './sidebar';
import reportStyles from '../styles/Reports.module.css';
import infoStyles from '../styles/Info.module.css';
import { useState, useEffect } from 'react';
import ibStyles from '../styles/IssueBoard.module.css';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import Modal from 'react-modal';


Modal.setAppElement('#__next'); // lets the DOM know how to manage focus with modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width:'500px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '30px',
  },
};

export default function AddView ({ onIssueAdded, type }) {
    const [showModal, setShowModal] = useState(false);
    const [assignees, setAssignees] = useState([]);
    const [issueData, setIssueData] = useState({assignee: '', title: '', description: '', storyPoints: ''});
    const [submit, setSubmit] = useState(false);
    const planningPoker = [1,2,3,5,8,13,21,34];

    const getTeamData = async () => {
        const user = auth.currentUser;
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team;
        const teamSnap = await getDoc(teamRef);
        await setAssignees(teamSnap.data().Members || []);
    }

    useEffect(() => {
        getTeamData();
        console.log(assignees);
    }, []);

    useEffect(() => {
        let tempSubmit = true;
        if (issueData.title === '' || issueData.description === '' || issueData.assignee === '' || issueData.storyPoints === '') {
            tempSubmit = false;
        }
        setSubmit(tempSubmit);
    }, [issueData]);

    const handleAddIssue = async () => {
        const user = auth.currentUser;
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team;
        const issuesRef = collection(teamRef, "Issues");

        await addDoc(issuesRef, {
            Title: issueData.title,
            Description: issueData.description,
            Assignee: issueData.assignee,
            StoryPoints: issueData.storyPoints,
            Status: 'To Do'
        });

        setShowModal(false);
        onIssueAdded();
    }

    return (
        <div>
            <button className={ibStyles.addIssue} onClick={() => setShowModal(true)}>{type === 'createIssue' ? 'Create issue' : 'Add an issue from suggestions'}</button>
            <Modal
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              style={customStyles}
              contentLabel="Select Next Due Date"
            >
                <h1 className={reportStyles.headingText} style={{marginBottom:'0'}}>Add an issue</h1>
                <p>Please add an issue title and description:</p>
                <input
                    value={issueData.title}
                    onChange={(e) => setIssueData({...issueData, title:e.target.value})}
                    className={reportStyles.inputBoxes}
                    style={{width: '40%', display: 'inline'}}
                    type="text"
                    placeholder="Issue Title"
                />
                <br></br>
                <input
                    value={issueData.description}
                    onChange={(e) => setIssueData({...issueData, description:e.target.value})}
                    className={reportStyles.inputBoxes}
                    style={{width: '90%', display: 'inline'}}
                    type="text"
                    placeholder="Description"
                />
                <p>Please select an assignee from your team:</p>
                <select 
                    value={issueData.assignee} 
                    onChange={(e) => setIssueData({...issueData, assignee:e.target.value})}
                    className={reportStyles.inputBoxes}
                    style={{width:'90%'}}
                >
                    <option value="">Select assignee</option>
                    {assignees.map((email) => (
                        <option key={email} value={email}>
                            {email}
                        </option>
                    ))}
                </select>
                <p>Please enter story points for your issue:</p>
                <select 
                    value={issueData.storyPoints} 
                    onChange={(e) => setIssueData({...issueData, storyPoints:e.target.value})}
                    className={reportStyles.inputBoxes}
                    style={{width:'90%'}}
                >
                    <option value="">Select effort estimation</option>
                    {planningPoker.map((number) => (
                        <option key={number} value={number}>
                            {number}
                        </option>
                    ))}
                </select>
                <button 
                    className={infoStyles.reportPageBtn} 
                    style={{fontFamily:'Manrope', float:'right', marginLeft:0}} 
                    onClick={() => setShowModal(false)}>
                        Cancel
                </button>
                <button 
                    className={infoStyles.reportPageBtn} 
                    style={{
                        fontFamily:'Manrope', 
                        float:'right',
                        pointerEvents: submit ? 'auto' : 'none',
                        opacity: submit ? '1' : '0.5',
                    }} 
                    onClick={handleAddIssue}>
                        Add issue
                </button>
            </Modal>
        </div>
    )
};