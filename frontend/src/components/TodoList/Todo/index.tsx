import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import { useAppDispatch } from '../../../store/hooks'
import { actions } from '../../../store/todoList'
import { EditButton, DeleteButton } from '../../../components/common/buttons'
import Donebox from './Donebox'
import DateLabel from './DateLabel'
import PriorityLabel from './PriorityLabel'
import { createHashRouteHandler } from '../../../common/utils'

import type { TodoItem } from '../../../common/types'

const StyledPaper = styled(Paper)`
padding: 5px 10px;

>div {
  display: flex;
  align-items: center;
}

>.todo-header {
  position: relative;

  >.todo-created-at, >.todo-updated-at {
    width: 120px;
  }

  >.todo-created-at {
    margin-left: auto;
  }

  >.todo-updated-at {
    margin: 0 88px 0 2px;
  }

  >.todo-priority {
    position: absolute;
    right: 0;
  }
}

>.todo-content {
  >.todo-detail {
    margin-left: 42px;
  }

  >.todo-buttons {
    margin-left: auto;

    >*:not(:first-child) {
      margin-left: 10px;
    }
  }
}
`

interface TodoProps {
  todoItem: TodoItem
}

const Todo: React.FC<TodoProps> = (props) => {
  const {
    todoItem,
  } = props

  const dispatch = useAppDispatch()

  const handleDelete = () => {
    axios.delete(`/todo_item/${todoItem.id}`)
      .then(() => dispatch(actions.requestRefetch()))
      .catch(console.error)
  }

  return (
    <StyledPaper>
      <div className='todo-header'>
        <Donebox
          todoItemId={todoItem.id}
          todoItemDone={todoItem.done}
        />
        <div className='todo-title'>
          {todoItem.title}
        </div>
        <DateLabel
          className='todo-created-at'
          dateStr={todoItem.created_at}
        />
        <DateLabel
          className='todo-updated-at'
          dateStr={todoItem.updated_at}
        />
        <PriorityLabel
          className='todo-priority'
          priority={todoItem.priority}
        />
      </div>
      <div className='todo-content'>
        <div className={clsx('todo-detail', 'font-color-gray')}>
          {todoItem.detail}
        </div>
        <div className='todo-buttons'>
          <EditButton
            size='small'
            onClick={createHashRouteHandler(`/edit/${todoItem.id}`)}
          />
          <DeleteButton
            size='small'
            onClick={handleDelete}
          />
        </div>
      </div>
    </StyledPaper>
  )
}

export default Todo
