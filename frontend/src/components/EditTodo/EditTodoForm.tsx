import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Formik, FormikHelpers } from 'formik'
import axios from 'axios'
import * as O from 'fp-ts/Option'
import TodoForm, { todoFormSchema, type TodoFormData } from '../common/TodoForm'
import Section from '../common/Section'
import { type TodoItem, type RequestError, tryMakeRequestError, errorMessages } from '../../common/types'
import { createHashRouteHandler } from '../../common/utils'
import { useAppDispatch } from '../../store/hooks'
import { actions } from '../../store/todoList'

const StyledSection = styled(Section)`
padding: 30px;

>*:not(:first-child) {
  margin: 32px 0 0 0;
}

.update-todo-error {
  color: firebrick;
  text-align: center;
}
`

const EditTodoForm = (props: { todoItem: TodoItem }) => {
  const {
    todoItem,
  } = props

  const mounted = useRef(false)

  const [error, setError] = useState<O.Option<RequestError>>(O.none)

  const dispatch = useAppDispatch()

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const handleRedirect = createHashRouteHandler('/')

  const handleSubmit = (values: TodoFormData, formik: FormikHelpers<TodoFormData>) => {
    setError(O.none)

    axios.patch(`/todo_item/${todoItem.id}`, values)
      .then(() => {
        if (!mounted.current) return

        dispatch(actions.requestRefetch())
        handleRedirect()
      })
      .catch(err => {
        console.error(err)
        if (!mounted.current) return

        setError(tryMakeRequestError(err))
        formik.setSubmitting(false)
      })
  }

  return (
    <StyledSection>
      <div className={clsx('font-size-4', 'font-weight-2')}>
        Edit Todo
      </div>
      <Formik
        initialValues={{
          title: todoItem.title,
          detail: todoItem.detail || '',
          priority: todoItem.priority,
        }}
        validationSchema={todoFormSchema}
        onSubmit={handleSubmit}
        children={TodoForm}
      />
      {
        O.isSome(error) &&
        <div className='update-todo-error'>
          {errorMessages(error.value).map(m => <React.Fragment key={m}>{m}<br /></React.Fragment>)}
        </div>
      }
    </StyledSection>
  )
}

export default EditTodoForm
