import './Style.css';
import React, { useState, useEffect } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs'
import { GiNetworkBars } from 'react-icons/gi';
import { BiSolidPencil } from 'react-icons/bi';

function TaskForm({ addTask }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() !== '') {
      addTask(task);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

function TaskItem({ task, toggleTask, deleteTask, editTask }) {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleEdit = () => {
    setEditedTitle(task.title);
    setEditMode(true);
  };

  const handleEditSave = () => {
    editTask(task.id, editedTitle);
    setEditMode(false);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
      />
      {!editMode ? (
        <span
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
          onClick={() => toggleTask(task.id)}
        >
          {task.title}
        </span>
      ) : (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
      )}
      <button onClick={() => deleteTask(task.id)} className='delete-btn'>
        <MdOutlineDeleteForever />
      </button>
      {editMode ? (
        <button onClick={handleEditSave} className='edit-btn'><BsCheckLg/></button>
      ) : (
        <button onClick={handleEdit} className='edit-btn'><BiSolidPencil/></button>
      )}
    </li>
  );
}

function TaskList({ tasks, toggleTask, deleteTask, editTask }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ))}
    </ul>
  );
}

function FilterOptions({ filter, setFilter, tasks }) {
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Calculate the count based on the filtered tasks
  const totalTasks = tasks.length < 10 ? `0${tasks.length}` : tasks.length;
  const completedTotal = tasks.filter((task) => task.completed).length;
  const completed = completedTotal < 10 ? `0${completedTotal}` : completedTotal;
  const incompleted = (+totalTasks - +completed) < 10 ? `0${+totalTasks - +completed}` : +totalTasks - +completed;

  return (
    <div className='filterSection'>
      <input
        type="radio"
        name="filter"
        value="all"
        checked={filter === 'all'}
        onChange={handleFilterChange}
        id="all"
      />
      <label htmlFor="all">
        All-{totalTasks}
      </label>
      <input
        type="radio"
        name="filter"
        value="completed"
        checked={filter === 'completed'}
        onChange={handleFilterChange}
        id="completed"
      />
      <label htmlFor="completed">
        Completed-{completed}
      </label>
      <input
        type="radio"
        name="filter"
        value="incomplete"
        checked={filter === 'incomplete'}
        onChange={handleFilterChange}
        id="incomplete"
      />
      <label htmlFor="incomplete">
        Incomplete-{incompleted}
      </label>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const editTask = (id, newTitle) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, title: newTitle };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    }
    if (filter === 'incomplete') {
      return !task.completed;
    }
    return true;
  });

  return (
    <div className="App">
      <h1>Task Manager <GiNetworkBars /></h1>
      <TaskForm addTask={addTask} />
      <FilterOptions filter={filter} setFilter={setFilter} tasks={tasks} />
      {
        tasks.length > 0 ?
          <TaskList
            tasks={filteredTasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}
          /> :
          <span className='no-task-notice'>Your task manager is empty.</span>
      }
      <footer className='copyrightline'>
        Copyright &#169; Naman Sharma <a href='https://www.linkedin.com/in/naman-sharma-b46950226/' target='_blank' rel="noopener noreferrer">About Me</a>
      </footer>
    </div>
  );
}

export default App;
