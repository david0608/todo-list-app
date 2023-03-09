import React from 'react'
import styled from 'styled-components'
import { FormikProps } from 'formik'
import * as Yup from 'yup'
import MenuItem from '@material-ui/core/MenuItem'
import Input from './Input'
import { CheckButton, CloseButton } from './buttons'
import { Priority } from '../../common/types'
import { createHashRouteHandler } from '../../common/utils'

export interface TodoFormData {
  title: string,
  detail: string,
  priority: Priority,
}

export const priorityMenuOptions: { label: string, value: Priority }[] = [
  {
    label: 'Critical',
    value: 3,
  },
  {
    label: 'Normal',
    value: 2,
  },
  {
    label: 'Low',
    value: 1,
  },
]

export const todoFormSchema = Yup.object().shape({
  title:
    Yup.string()
      .required('required')
      .max(64, 'Can not exceed 64 characters.'),
  detail:
    Yup.string()
      .max(256, 'Can not exceed 256 characters.'),
  priority:
    Yup.number()
      .required('required')
})

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

const TodoForm = (props: FormikProps<TodoFormData>) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = props

  const errorStatus = (name: keyof TodoFormData) => touched[name] && errors[name] ? true : false
  const errorMsg = (name: keyof TodoFormData) => touched[name] ? errors[name] : undefined

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
        name='detail'
        label='Detail'
        placeholder='Todo detail.'
        value={values.detail}
        onChange={handleChange}
        error={errorStatus('detail')}
        helperText={errorMsg('detail')}
        InputProps={{
          onBlur: handleBlur
        }}
      />
      <Input
        select
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
      >
        {priorityMenuOptions.map(option => (
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

export default TodoForm
