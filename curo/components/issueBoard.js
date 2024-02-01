import Link from 'next/link';
import Head from 'next/head';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import Header from './Header';
import SideBar from './sidebar';
import { useState, useEffect } from 'react';
import styles from '../styles/IssueBoard.module.css';
import ibStyles from '../styles/IssueBoard.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

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
    issues[doc.data().Status].push(doc.data().Title);
  });

  return issues;
};

const initialTasks = {
  'To Do:': [],
  'In Progress:': [],
  'Complete': []
};

export default function IssueBoard() {
  const [tasks, setTasks] = useState({ 'To Do': [], 'In Progress': [], 'Complete': [] });

  useEffect(() => {
    const loadIssues = async () => {
      const fetchedIssues = await fetchIssues();
      setTasks(fetchedIssues);
    };

    loadIssues();
  }, []);

  const onDragEnd = result => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setTasks({ ...tasks, [source.droppableId]: items });
    } else {
      const sourceItems = Array.from(tasks[source.droppableId]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      const destinationItems = Array.from(tasks[destination.droppableId]);
      destinationItems.splice(destination.index, 0, movedItem);

      setTasks({ 
        ...tasks, 
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems 
      });
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
              {Object.keys(tasks).map((columnId) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                    className={ibStyles.issueColumn}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h3 className={ibStyles.columnHeader}>{columnId}</h3>
                      {tasks[columnId].map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={ibStyles.issueDiv}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h1>{item}</h1>
                              <p>Assignees: test test</p>
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

