import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import store from './store/store'
import TodoListRefetchWorker from './components/workers/TodoListRefetchWorker'
import AddTodo from './components/AddTodo'
import EditTodo from './components/EditTodo'
import TodoList from './components/TodoList'
import './styles/index.less'
import './styles/font.less'

axios.defaults.baseURL = 'http://127.0.0.1:8000'

ReactDOM.render(
  <Provider store={store}>
    <TodoListRefetchWorker />
    <HashRouter>
      <Switch>
        <Route path='/add'>
          <AddTodo />
        </Route>
        <Route path='/edit'>
          <EditTodo />
        </Route>
        <Route path='/'>
          <TodoList />
        </Route>
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
