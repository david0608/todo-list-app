import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import { TodoItem, FilterOptions } from '../common/types'

interface TodoListState {
  inited: boolean
  busy: boolean
  shouldRefetch: boolean
  error: boolean
  todoItems: TodoItem[]
  filterOptions: FilterOptions
}

const initialState: TodoListState = {
  inited: false,
  busy: false,
  shouldRefetch: false,
  error: false,
  filterOptions: {
    search: '',
    priority: undefined,
    done: undefined,
    sortKey: 'created_at',
    reverse: false,
  },
  todoItems: [],
}

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    startRefetch: (state) => {
      state.busy = true
      state.shouldRefetch = false
      state.error = false
    },
    requestRefetch: (state) => {
      state.shouldRefetch = true
    },
    successResponse: (state, action: PayloadAction<TodoListState['todoItems']>) => {
      state.inited = true
      state.busy = false
      state.todoItems = action.payload
    },
    errorResponse: (state) => {
      state.inited = true
      state.busy = false
      state.error = true
    },
    updateSearch: (state, action: PayloadAction<TodoListState['filterOptions']['search']>) => {
      state.shouldRefetch = true
      state.filterOptions.search = action.payload
    },
    updatePriorityFilter: (state, action: PayloadAction<TodoListState['filterOptions']['priority']>) => {
      state.shouldRefetch = true
      state.filterOptions.priority = action.payload
    },
    updateDoneFilter: (state, action: PayloadAction<TodoListState['filterOptions']['done']>) => {
      state.shouldRefetch = true
      state.filterOptions.done = action.payload
    },
    updateSortKey: (state, action: PayloadAction<{ sortKey: TodoListState['filterOptions']['sortKey'], reverse: TodoListState['filterOptions']['reverse'] }>) => {
      state.shouldRefetch = true
      state.filterOptions.sortKey = action.payload.sortKey
      state.filterOptions.reverse = action.payload.reverse
    }
  }
})

export default todoListSlice.reducer

export const actions = todoListSlice.actions

export const todoItemSelector: (id: string) => (state: TodoListState) => TodoItem | undefined =
  (id) => (state) => pipe(
    state.todoItems,
    A.findFirst((item) => item.id === id),
    O.toUndefined,
  )
