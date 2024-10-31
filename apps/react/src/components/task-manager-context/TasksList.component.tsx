import { Task } from './Task.component';
import { useTasks } from './TasksContext.component';
import styles from './TasksList.module.css';

export function TasksList() {
  const tasks = useTasks();
  const tasksList = tasks.map((task) => {
    return <Task task={task} key={task.id} />;
  });

  return (
    <form>
      <ol className={styles['tasks-list']}>{tasksList}</ol>
    </form>
  );
}
