import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Formik, FormikHelpers } from 'formik'
import axios from 'axios'
import * as O from 'fp-ts/Option'
import TodoForm, { todoFormSchema, type TodoFormData } from '../common/TodoForm'
import Section from '../common/Section'
import { createHashRouteHandler } from '../../common/utils'
import { type RequestError, tryMakeRequestError, errorMessages } from '../../common/types'
import { useAppDispatch } from '../../store/hooks'
import { actions } from '../../store/todoList'

const initialFormValues: TodoFormData = {
  title: '',
  detail: '',
  priority: 2,
}

const StyledSection = styled(Section)`
padding: 30px;

>*:not(:first-child) {
  margin: 32px 0 0 0;
}

.add-todo-error {
  color: firebrick;
  text-align: center;
}
`

const AddTodoForm = () => {
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

    axios.post('/todo_item', values)
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
        Create Todo
      </div>
      <Formik
        initialValues={initialFormValues}
        validationSchema={todoFormSchema}
        onSubmit={handleSubmit}
        children={TodoForm}
      />
      {
        O.isSome(error) &&
        <div className='add-todo-error'>
          {errorMessages(error.value).map(m => <React.Fragment key={m}>{m}<br /></React.Fragment>)}
        </div>
      }
    </StyledSection>
  )
}

export default AddTodoForm
