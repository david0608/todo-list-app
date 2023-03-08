import React from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Donebox from './Donebox'

import type { TodoItem } from '../../../common/types'

const StyledPaper = styled(Paper)`
>div {
  display: flex;
}
`

interface TodoProps {
  todoItem: TodoItem
}

const Todo: React.FC<TodoProps> = (props) => {
  const {
    todoItem,
  } = props

  return (
    <StyledPaper>
      <div className='todo-header'>
        <Donebox />
        <div className='todo-title'>
          {todoItem.title}
        </div>
        <div className='todo-updated-at'>
          {todoItem.updated_at}
        </div>
        <div className='todo-created-at'>
          {todoItem.created_at}
        </div>
        <div className='todo-priority'>
          {todoItem.priority}
        </div>
      </div>
      <div className='todo-content'>
        {todoItem.detail}
      </div>
    </StyledPaper>
  )
}

export default Todo
