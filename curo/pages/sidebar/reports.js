import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import "@fontsource/montserrat";
import '@fontsource-variable/karla';
import "@fontsource/manrope";
import Header from '../../components/Header';
import SideBar from '../../components/sidebar';
import { useState } from 'react';
import ibStyles from '../../styles/IssueBoard.module.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = {
  'To Do:': ['Task 1', 'Task 2', 'Task 3'],
  'In Progress:': [],
  'Complete': []
};

export default function Reports() {

  const [tasks, setTasks] = useState(initialTasks);

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
          <SideBar/>

          <div className={styles.dashboard}>
            <Header title="Reports"/>

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
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {item}
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

