import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';

import all from './all.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    this.state = {
      insert: false,
      value: '',
      tasks: tasks || [],
    };
  }

  handleChange = e => this.setState({ value: e.target.value });

  addItem = () => {
    const { tasks, value } = this.state;
    tasks.unshift({
      index: tasks.length,
      value,
      done: false,
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.setState({
      value: '',
      tasks,
    });
  };

  removeItem = idx => {
    const { tasks } = this.state;
    tasks.splice(idx, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.setState({ tasks });
  };

  markToDone = idx => {
    const { tasks } = this.state;
    const task = tasks[idx];
    task.done = !task.done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.setState({ tasks });
  };

  render() {
    const { insert, value, tasks } = this.state;
    const pendingTasks = tasks.filter(t => !t.done);
    ipcRenderer.send('task-updated', pendingTasks.length);
    return (
      <div className="App">
        {tasks.length > 0 ? (
          <div>
            {tasks.map((t, idx) => (
              <div key={t.index}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    height: 56,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                      <Icon
                        onClick={() => this.markToDone(idx)}
                        className="Icon-done"
                        style={{
                          color: '#0091EA',
                          marginLeft: 16,
                          marginRight: 16,
                        }}
                        component="div"
                      >
                        {t.done ? 'check_circle' : 'check_circle_outline'}
                      </Icon>
                    </div>
                    <div
                      style={{
                        fontFamily: 'Roboto',
                        fontSize: 16,
                        color: 'rgba(0, 0, 0, 0.6)',
                        textDecoration: t.done ? 'line-through' : 'none',
                      }}
                    >
                      {t.value}
                    </div>
                  </div>
                  <div>
                    <Icon
                      className="Icon-remove"
                      fontSize="small"
                      component="div"
                      onClick={() => this.removeItem(idx)}
                    >
                      close
                    </Icon>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <img className="App-empty" src={all} alt="logo" />
        )}
        {insert ? (
          <div className="App-action">
            <InputBase
              style={{ marginLeft: 16, width: 900 }}
              autoFocus
              placeholder="Adicionar nova tarefa"
              value={value}
              onChange={this.handleChange}
              inputProps={{ 'aria-label': 'naked' }}
              onKeyPress={e => e.key === 'Enter' && this.addItem()}
            />
            <div
              className="Icon-close-wrapper"
              onClick={() => this.setState({ insert: false })}
            >
              <Icon className="Icon-close" fontSize="small" component="div">
                close
              </Icon>
            </div>
          </div>
        ) : (
          <div
            className="App-action"
            onClick={() => this.setState({ insert: true })}
          >
            <div className="Icon-wrapper">
              <Icon className="Icon" fontSize="small" component="div">
                add
              </Icon>
            </div>
            <p className="App-action-text">Adicionar tarefa</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
