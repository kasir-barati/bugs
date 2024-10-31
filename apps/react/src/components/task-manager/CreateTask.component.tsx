import { ChangeEvent, useState } from 'react';
import styles from './CreateTask.module.css';

interface CreateTaskProps {
  onCreate(taskName: string): void;
}

export function CreateTask({ onCreate }: Readonly<CreateTaskProps>) {
  const [taskName, setTaskName] = useState<string>('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTaskName(e.target.value);
  }
  function handleClickAdd() {
    if (!taskName || taskName?.trim()?.length === 0) {
      throw 'A task with no name, cannot create such a task!';
    }
    setTaskName('');
    onCreate(taskName);
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
