import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import AddTodo from './AddTodo'
import EditTodo from './EditTodo'
import TodoList from './TodoList'
import './styles/index.less'
import './styles/font.less'

ReactDOM.render(
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
  </HashRouter>,
  document.getElementById('root')
)
