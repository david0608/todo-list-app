import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'

const StyledCheckbox = styled(Checkbox)`
&.MuiCheckbox-root.Mui-checked {
  color: limegreen;
}

&:hover .MuiTouchRipple-root {
  background-color: rgba(21, 238, 24, 0.04);
}
`

interface DoneboxProps { }

const Donebox: React.FC<DoneboxProps> = (props) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked)
  }

  return (
    <StyledCheckbox
      onChange={handleChange}
    />
  )
}

export default Donebox
