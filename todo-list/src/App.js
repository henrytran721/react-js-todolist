import React, { Component } from 'react';
import './App.css';

let backgroundColors = {
  blue: '#aec6cf',
  red: '#ff6961',
  green: '#77dd77',
  violet: '#cb99c9',
  orange: '#ffb347',
  pink: '#ffd1dc'
};

const mainBody = document.getElementById('root');

function LightenDarkenColor(colorCode, amount) {
    var usePound = false;
    if (colorCode[0] == "#") {
        colorCode = colorCode.slice(1);
        usePound = true;
    }
    var num = parseInt(colorCode, 16);
    var r = (num >> 16) + amount;
    if (r > 255) {
        r = 255;
    } else if (r < 0) {
        r = 0;
    }
    var b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) {
        b = 255;
    } else if (b < 0) {
        b = 0;
    }
    var g = (num & 0x0000FF) + amount;
    if (g > 255) {
        g = 255;
    } else if (g < 0) {
        g = 0;
    }
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function MainBody(props) {
  return (
    <div onClick={props.onHandleBackground()}>
      <header>
      <h1>To-Do List</h1>
      </header>
      <div className='todoContainer'>
        <input type='text'
          value={props.taskValue}
          onChange={props.onChange}
        />
        <button className='addBtn' onClick={() => props.onAddTask()}><span>Add Task</span></button>
      </div>
      <div className='completedContainer'>
        <h1>Completed Tasks</h1>
        <ul>
        {props.list.map((cTask) => (
          <li key={cTask.taskName}>
            <span>&#10004;     </span>
            <span>{cTask.taskName}</span>
          </li>
        ))}
        </ul>
      </div>
      </div>
  )
}

function ShowTasks(props) {
  if(props.list.length === 0) {
    return (
    <div className='noTaskDiv'>
      <div className='noTask'>
        <p>You currently have no tasks. Please add a task to proceed!</p>
      </div>
    </div>
    )
  } else {
    return (
      <div className='newTask'>
        {props.list.map((task) => (
          <div className='tasks' key={task.taskName}>
          <button className='deleteBtn' onClick={() => props.onDelete(task.taskName)}><span>X</span></button>
          <span>{task.taskName}</span>
          <button className='notCompleted' onClick={() =>props.onHandleCompletedTask(task.taskName)}>{task.taskCompleted}</button>
          </div>
        ))}
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: backgroundColors.blue,
      tasks: [],
      input: '',
      inputIsEmpty: true,
      completedTasks: [],
    }
    this.updateInput=this.updateInput.bind(this)
    this.addTask=this.addTask.bind(this)
    this.handleBackground = this.handleBackground.bind(this);
    this.deleteTask=this.deleteTask.bind(this);
    this.handleCompletedTask=this.handleCompletedTask.bind(this);
    this.hydrateState = this.hydrateState.bind(this);
  }

  componentDidMount() {
    this.hydrateState();
  }
  componentDidUpdate() {
    let tasks = [...this.state.tasks];
    localStorage.setItem('list', JSON.stringify(tasks));

    let completed = [...this.state.completedTasks];
    localStorage.setItem('completed', JSON.stringify(completed));
  }
  updateInput(e) {
    const taskValue=e.target.value;
    this.setState({
      input: taskValue
    })

    localStorage.setItem('task', taskValue);
  }

  addTask() {

    let keys = Object.keys(backgroundColors);
    let color = backgroundColors[keys[keys.length * Math.random() << 0]];
    if(this.state.input === '') {
      alert('Please enter a task.');
    } else {
      this.setState((currentState) => {
        return {
          bgColor: color,
          tasks: currentState.tasks.concat([
            {
              taskName: currentState.input.charAt(0).toUpperCase() + currentState.input.slice(1),
              taskCompleted: 'Not Completed'
            }
          ]),
          input: ''
        }
      })
    }
  }

  handleBackground() {
    if(document.querySelector('.addBtn')) {
      document.querySelector('.addBtn').style.backgroundColor = LightenDarkenColor(this.state.bgColor, -20);
    }
    if(document.querySelector('.completedContainer')) {
      document.querySelector('.completedContainer').style.backgroundColor = LightenDarkenColor(this.state.bgColor, -20);
    }

    document.body.style.backgroundColor = this.state.bgColor;
  }

  deleteTask(taskName) {
    this.setState((currentState) => {
      return {
        tasks: currentState.tasks.filter((task) => task.taskName !== taskName)
      }
      console.log(currentState.tasks);
    })

    // update localStorage
  }

  handleCompletedTask(taskName) {
    console.log('working');
    this.setState((currentState) => {
      const cTask = currentState.tasks.find((task) => task.taskName === taskName);
      return {
        completedTasks: currentState.completedTasks.concat([
          {
            taskName: cTask.taskName,
            taskCompleted: 'Completed'
          }
        ]),
        tasks: currentState.tasks.filter((task) => task.taskName !== taskName)
      }
    })
  }

  hydrateState() {
    if(localStorage.length !== 0) {
      console.log(typeof(localStorage.list));
      let data = JSON.parse(localStorage.list);
      let cData = JSON.parse(localStorage.completed);
      console.log(data);
      this.setState((currentState) => {
        return {
          tasks: currentState.tasks.concat(data),
          completedTasks: currentState.completedTasks.concat(cData)
        }
      });
    }
  }

  render() {
    return (
      <div className='body'>
      <MainBody
        taskValue={this.state.input}
        onHandleBackground={this.handleBackground}
        onChange={this.updateInput}
        onAddTask={this.addTask}
        list={this.state.completedTasks}
      />
      <ShowTasks
      list={this.state.tasks}
      onDelete={this.deleteTask}
      onHandleCompletedTask={this.handleCompletedTask}
      />
      </div>
    );
  }
}

export default App;
