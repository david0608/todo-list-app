import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../store/hooks'
import Header from '../common/Header'
import Section from '../common/Section'
import FilterBar from './FilterBar'
import SortBar from './SortBar'
import Todo from './Todo'

const StyledSection = styled(Section)`
padding: 20px;

>*:not(:first-child) {
  margin-top: 10px;
}
`

const TodoList = () => {
  const todoItems = useAppSelector(state => state.todoList.todoItems)

  return (
    <React.Fragment>
      <Header />
      <StyledSection>
        <FilterBar />
        <SortBar />
        {
          todoItems.map((item) => <Todo key={item.id} todoItem={item} />)
        }
      </StyledSection>
    </React.Fragment>
  )
}

export default TodoList
