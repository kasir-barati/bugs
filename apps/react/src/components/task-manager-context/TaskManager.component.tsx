import { CreateTask } from './CreateTask.component';
import styles from './TaskManager.module.css';
import { TasksProvider } from './TasksContext.component';
import { TasksList } from './TasksList.component';

export function TaskManager() {
  return (
    <TasksProvider>
      <section className={styles['task-manager']}>
        <h2>Task manager</h2>
        <CreateTask />
        <TasksList />
      </section>
    </TasksProvider>
  );
}
