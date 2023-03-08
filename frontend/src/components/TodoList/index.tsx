import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../store/hooks'
import Header from '../common/Header'
import Section from '../common/Section'
import Todo from './Todo'

const StyledSection = styled(Section)`
padding: 20px;
box-sizing: border-box;

>*:not(:first-child) {
  margin-top: 10px;
}
`

const TodoList = () => {
  const todoItems = useAppSelector(state => state.todoList.todoItems)
  console.log(todoItems)

  return (
    <React.Fragment>
      <Header />
      <StyledSection>
        {
          todoItems.map((item) => <Todo key={item.id} todoItem={item} />)
        }
      </StyledSection>
    </React.Fragment>
  )
}

export default TodoList
