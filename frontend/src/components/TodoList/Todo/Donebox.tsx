import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import { useAppDispatch } from '../../../store/hooks'
import { actions } from '../../../store/todoList'
import type { TodoItem } from '../../../common/types'

const StyledCheckbox = styled(Checkbox)`
&.MuiCheckbox-root.Mui-checked {
  color: limegreen;
}

&:hover .MuiTouchRipple-root {
  background-color: rgba(21, 238, 24, 0.04);
}
`

interface DoneboxProps {
  todoItemId: TodoItem['id']
  todoItemDone: TodoItem['done']
}

const Donebox: React.FC<DoneboxProps> = (props) => {
  const {
    todoItemId,
    todoItemDone,
  } = props

  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    axios.patch(`/todo_item/${todoItemId}`, { done: e.target.checked })
      .then(() => dispatch(actions.requestRefetch()))
      .catch(console.error)
  }

  return (
    <StyledCheckbox
      checked={todoItemDone}
      onChange={handleChange}
    />
  )
}

export default Donebox
