import { ChangeEvent, useState } from 'react';
import styles from './CreateTask.module.css';
import { useTasksDispatch } from './TasksContext.component';

export function CreateTask() {
  const [taskName, setTaskName] = useState<string>('');
  const dispatch = useTasksDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTaskName(e.target.value);
  }
  function handleClickAdd() {
    if (!taskName || taskName?.trim()?.length === 0) {
      throw 'A task with no name, cannot create such a task!';
    }

    dispatch({
      type: 'create',
      taskName,
    });
  }

  return (
    <p className={styles['create-task']}>
      <input
        type="text"
        name="taskName"
        value={taskName}
        onChange={handleChange}
      />
      <button type="button" onClick={handleClickAdd}>
        Create
      </button>
    </p>
  );
}
