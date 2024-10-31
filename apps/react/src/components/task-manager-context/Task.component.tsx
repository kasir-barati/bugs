import { ChangeEvent, useState } from 'react';
import { Task as TaskType } from '../../types/task.type';
import styles from './Task.module.css';
import { useTasksDispatch } from './TasksContext.component';

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: Readonly<TaskProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [inProgress, setInProgress] = useState(task.inProgress);
  const [name, setName] = useState(task.name);
  const dispatch = useTasksDispatch();

  function handleClickUpdate() {
    setIsEditing(true);
  }
  function handleClickSave() {
    dispatch({
      type: 'update',
      taskId: task.id,
      taskName: name,
      taskInProgress: inProgress,
    });
    setIsEditing(false);
  }
  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  function handleChangeInProgress() {
    setInProgress(!inProgress);
    dispatch({
      type: 'update',
      taskId: task.id,
      taskName: task.name,
      taskInProgress: !inProgress,
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
        onClick={() => dispatch({ type: 'delete', taskId: task.id })}
      >
        Delete
      </button>
    </li>
  );
}
