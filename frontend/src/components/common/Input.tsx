import React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'

const StyledTextField = styled(TextField)`
label.Mui-focused:not(.Mui-error) {
  color: black;
}

.MuiFilledInput-underline:after {
  border-bottom-color: black;
}

.MuiOutlinedInput-root {
  .MuiInputBase-input, .MuiSelect-select {
    background-color: white;
  }

  &:not(.Mui-error).Mui-focused fieldset {
    border-color: black;
  }
}

.MuiFormHelperText-root.Mui-error {
  position: absolute;
  bottom: 0;
  transform: translate(0, 20px);
}
`

const Input = (props: React.ComponentProps<typeof TextField>) => {
  return (
    <StyledTextField
      variant='outlined'
      fullWidth
      {...props}
    />
  )
}

export default Input
