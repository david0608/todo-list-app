import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Formik, FormikProps, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import MenuItem from '@material-ui/core/MenuItem'
import Section from '../common/Section'
import Input from '../common/Input'
import { CheckButton, CloseButton } from '../common/buttons'
import { Priority } from '../../common/types'
import { createHashRouteHandler } from '../../common/utils'
import { useAppDispatch } from '../../store/hooks'
import { actions } from '../../store/todoList'

interface CreateTodoData {
  title: string,
  details: string,
  priority: Priority,
}

const initialFormValues: CreateTodoData = {
  title: '',
  details: '',
  priority: 2,
}

const createTodoFormSchema = Yup.object().shape({
  title:
    Yup.string()
      .required('required')
      .max(64, 'Can not exceed 64 characters.'),
  details:
    Yup.string()
      .max(256, 'Can not exceed 256 characters.'),
  priority:
    Yup.number()
      .required('required')
})

const priorityOptions = [
  {
    label: 'Critical',
    value: 1,
  },
  {
    label: 'Normal',
    value: 2,
  },
  {
    label: 'Low',
    value: 3,
  },
]

const StyledForm = styled.form`
>*:not(:first-child) {
  margin: 32px 0 0 0;
}

.form-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;

  >*:not(:first-child) {
    margin-left: 30px;
  }
}
`

const Form = (props: FormikProps<CreateTodoData>) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = props

  const errorStatus = (name: keyof CreateTodoData) => touched[name] && errors[name] ? true : false
  const errorMsg = (name: keyof CreateTodoData) => touched[name] ? errors[name] : undefined

  const onSubmit = isSubmitting ? (e: React.FormEvent<HTMLFormElement>) => e.preventDefault() : handleSubmit

  return (
    <StyledForm
      onSubmit={onSubmit}
    >
      <Input
        name='title'
        label='Title'
        placeholder='Title of todo item.'
        value={values.title}
        onChange={handleChange}
        error={errorStatus('title')}
        helperText={errorMsg('title')}
        InputProps={{
          onBlur: handleBlur
        }}
      />
      <Input
        name='details'
        label='Details'
        placeholder='Todo details.'
        value={values.details}
        onChange={handleChange}
        error={errorStatus('details')}
        helperText={errorMsg('details')}
        InputProps={{
          onBlur: handleBlur
        }}
      />
      <Input
        name='priority'
        label='Priority'
        placeholder='Todo priority.'
        value={values.priority}
        onChange={handleChange}
        error={errorStatus('priority')}
        helperText={errorMsg('priority')}
        InputProps={{
          onBlur: handleBlur
        }}
        select
      >
        {priorityOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Input>
      <div className='form-buttons'>
        <CloseButton onClick={createHashRouteHandler('/')} />
        <CheckButton type='submit' />
      </div>
    </StyledForm>
  )
}

const StyledSection = styled(Section)`
padding: 30px;
box-sizing: border-box;

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

  const [error, setError] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const handleRedirect = createHashRouteHandler('/')

  const handleSubmit = (values: CreateTodoData, formik: FormikHelpers<CreateTodoData>) => {
    setError(false)

    axios.post('/todo_item', values)
      .then(() => {
        if (!mounted.current) return

        dispatch(actions.requestRefetch())
        handleRedirect()
      })
      .catch(err => {
        console.error(err)
        if (!mounted.current) return

        setError(true)
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
        validationSchema={createTodoFormSchema}
        onSubmit={handleSubmit}
        children={Form}
      />
      {error && <div className='add-todo-error'>Failed to create todo. Please try again.</div>}
    </StyledSection>
  )
}

export default AddTodoForm
