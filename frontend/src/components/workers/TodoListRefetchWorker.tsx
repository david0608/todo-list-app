import { useEffect } from 'react'
import axios from 'axios'
import { isRight } from 'fp-ts/Either'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { actions } from '../../store/todoList'
import { makeArrayOfTodoItem } from '../../common/types'

const TodoListRefetchWorker = () => {
  const inited = useAppSelector(state => state.todoList.inited)
  const busy = useAppSelector(state => state.todoList.busy)
  const shouldRefetch = useAppSelector(state => state.todoList.shouldRefetch)
  const filterOptions = useAppSelector(state => state.todoList.filterOptions)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (busy || (inited && !shouldRefetch)) return

    dispatch(actions.startRefetch())

    axios.get('/todo_item', { params: filterOptions })
      .then((response) => {
        const e = makeArrayOfTodoItem(response.data.data)
        if (isRight(e)) {
          dispatch(actions.successResponse(e.right))
        } else {
          console.error(e.left)
          dispatch(actions.errorResponse())
        }
      })
      .catch((error) => {
        console.error(error)
        dispatch(actions.errorResponse())
      })
  })

  return null
}

export default TodoListRefetchWorker
