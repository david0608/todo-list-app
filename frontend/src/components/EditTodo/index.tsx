import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { todoItemSelector } from '../../store/todoList'
import Header from '../common/Header'
import { createHashRouteHandler } from '../../common/utils'
import EditTodoForm from './EditTodoForm'

const EditTodo = () => {
  const param = useParams<{ id: string }>()
  const todoItem = useAppSelector(state => todoItemSelector(param.id)(state.todoList))

  useEffect(() => {
    if (todoItem === undefined) {
      createHashRouteHandler('/')()
    }
  }, [])

  if (todoItem) {
    return (
      <React.Fragment>
        <Header />
        <EditTodoForm todoItem={todoItem}/>
      </React.Fragment>
    )
  } else {
    return null
  }
}

export default EditTodo
