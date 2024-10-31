import { ChangeEvent, useState } from 'react';
import { Task as TaskType } from '../../types/task.type';
import styles from './Task.module.css';

interface TaskProps {
  task: TaskType;
  onDelete(taskId: string): void;
  onUpdate(task: TaskType): void;
}

export function Task({
  task,
  onUpdate,
  onDelete,
}: Readonly<TaskProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [inProgress, setInProgress] = useState(task.inProgress);
  const [name, setName] = useState(task.name);

  function handleClickUpdate() {
    setIsEditing(true);
  }
  function handleClickSave() {
    onUpdate({
      id: task.id,
      name: name,
      inProgress: inProgress,
    });
    setIsEditing(false);
  }
  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  function handleChangeInProgress() {
    setInProgress(!inProgress);
    onUpdate({
      id: task.id,
      name: task.name,
      inProgress: !inProgress,
    });
  }

  return (
    <li className={styles.task}>
      <input
        type="checkbox"
        name="in-progress"
        id={`in-progress-${task.id}`}
        checked={inProgress}
        onChange={handleChangeInProgress}
      />
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChangeName}
          />
          <button
            type="button"
            className={styles['save-task-btn']}
            onClick={handleClickSave}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <label htmlFor={`in-progress-${task.id}`}>
            {task.name}
          </label>
          <button
            type="button"
            className={styles['update-task-btn']}
            onClick={handleClickUpdate}
          >
            Update
          </button>
        </>
      )}
      <button
        type="button"
        className={styles['delete-task-btn']}
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}
