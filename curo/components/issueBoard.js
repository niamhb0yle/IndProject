import Link from 'next/link';
import Head from 'next/head';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import Header from './Header';
import SideBar from './sidebar';
import reportStyles from '../styles/Reports.module.css';
import { useState, useEffect } from 'react';
import styles from '../styles/IssueBoard.module.css';
import ibStyles from '../styles/IssueBoard.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

{/*
const fetchIssues = async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.email);
  const userSnap = await getDoc(userRef);
  const teamRef = userSnap.data().Team
  const issuesRef = collection(teamRef, "Issues");

  const q = query(issuesRef, where('Status', 'in', ['To Do', 'In Progress', 'Complete']));
  const querySnapshot = await getDocs(q);
  let issues = { 'To Do': [], 'In Progress': [], 'Complete': [] };

  querySnapshot.forEach((doc) => {
    const issueData = doc.data();
    issues[issueData.Status].push({
      title: issueData.Title,
      assignee: issueData.Assignee,
      description: issueData.Description
    });
  });

  return issues;
};
*/}

export default function IssueBoard({ issues, setIssues }) {

  const onDragEnd = async (result) => {
    const { source, destination } = result;
  
    // Dropped outside the list
    if (!destination) {
      return;
    }
  
    // Identifying the moved item
    const movedItem = issues[source.droppableId][source.index];
  
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(issues[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
  
      setIssues({ ...issues, [source.droppableId]: items });
    } else {
      // Remove item from source column
      const sourceItems = Array.from(issues[source.droppableId]);
      sourceItems.splice(source.index, 1);
  
      // Add item to destination column
      const destinationItems = Array.from(issues[destination.droppableId] || []);
      destinationItems.splice(destination.index, 0, movedItem);
  
      setIssues({ 
        ...issues, 
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems 
      });
  
      // Update issue status in Firestore
      try {
        const user = auth.currentUser;
        const userRef = doc(db, "Users", user.email);
        const userSnap = await getDoc(userRef);
        const teamRef = userSnap.data().Team;
        const issueRef = doc(db, `Teams/${teamRef.id}/Issues`, movedItem.id);
        await updateDoc(issueRef, {
          Status: destination.droppableId
        });
        console.log("Issue status updated successfully.");
      } catch (error) {
        console.error("Error updating issue status: ", error);
      }
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

          <div className={styles.dashboard}>

            <div className={styles.dashboardContent}>
              
            <div className={ibStyles.boardContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
              {Object.keys(issues).map((columnId) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      className={ibStyles.issueColumn}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h3 className={ibStyles.columnHeader}>{columnId}</h3>
                      {issues[columnId].map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={ibStyles.issueDiv}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h1>{item.title}</h1>
                              <p>Assignee: {item.assignee}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
      ))}
    </DragDropContext>
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

