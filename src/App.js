import './Style.css';
import React, { useState, useEffect } from 'react';
import {MdOutlineDeleteForever} from 'react-icons/md'
import {BsCheckLg} from 'react-icons/bs'

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

function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <li>
      <span
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
        onClick={() => toggleTask(task.id)}
      >
        {task.title}
      </span>
      <button onClick={() => deleteTask(task.id)} className='delete-btn'><MdOutlineDeleteForever/></button>
      {!task.completed && (
        <button onClick={() => toggleTask(task.id)} className='complete-btn'><BsCheckLg/></button>
      )}
    </li>
  );
}

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
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
    <div>
      <label>
        <input
          type="radio"
          name="filter"
          value="all"
          checked={filter === 'all'}
          onChange={handleFilterChange}
        />
        All[{totalTasks}]
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          value="completed"
          checked={filter === 'completed'}
          onChange={handleFilterChange}
        />
        Completed[{completed}]
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          value="incomplete"
          checked={filter === 'incomplete'}
          onChange={handleFilterChange}
        />
        Incomplete[{incompleted}]
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
      <h1>Task Manager</h1>
      <TaskForm addTask={addTask} />
      <FilterOptions filter={filter} setFilter={setFilter} tasks={tasks}/>
      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
