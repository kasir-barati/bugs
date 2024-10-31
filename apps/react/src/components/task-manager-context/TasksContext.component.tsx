import { tasks as initialTasks } from '../../dummy-data/tasks.dummy-data';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import { Task } from '../../types/task.type';

const TasksContext = createContext<Task[] | null>(null);
const TasksDispatchContext =
  createContext<Dispatch<TaskManagerAction> | null>(null);

export function TasksProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const [tasks, dispatch] = useReducer(reducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
export function useTasks() {
  const tasks = useContext(TasksContext);

  if (!tasks) {
    throw 'NullTasksContext';
  }

  return tasks;
}
export function useTasksDispatch() {
  const dispatch = useContext(TasksDispatchContext);

  if (!dispatch) {
    throw 'NullTasksDispatchContext';
  }

  return dispatch;
}

// discriminated unions
interface CreateTaskManagerAction {
  type: 'create';
  taskName: string;
}
interface UpdateTaskManagerAction {
  type: 'update';
  taskId: string;
  taskName: string;
  taskInProgress: boolean;
}
interface DeleteTaskManagerAction {
  type: 'delete';
  taskId: string;
}
type TaskManagerAction =
  | CreateTaskManagerAction
  | UpdateTaskManagerAction
  | DeleteTaskManagerAction;

function reducer(tasks: Task[], action: TaskManagerAction): Task[] {
  if (action.type === 'create') {
    return [
      ...tasks,
      {
        id: Math.random().toString(),
        name: action.taskName,
        inProgress: false,
      },
    ];
  }
  if (action.type === 'update') {
    return tasks.map((task) => {
      if (task.id === action.taskId) {
        return {
          id: task.id,
          name: action.taskName,
          inProgress: action.taskInProgress,
        };
      }
      return task;
    });
  }
  if (action.type === 'delete') {
    return tasks.filter((task) => task.id !== action.taskId);
  }

  throw 'invalid action type!';
}
