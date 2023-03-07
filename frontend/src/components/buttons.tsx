import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'

const StyledIconButton = styled(IconButton)`
&.MuiIconButton-root {
  color: white;
}

&, &:hover {
  &.green {
    background-color: lightgreen;
  }

  &.red {
    background-color: lightcoral;
  }
}
`

type IconButtonProps = React.ComponentProps<typeof IconButton>

const createIconButton = ( IconComponent: React.ComponentType, colorClass: string ) => (props: IconButtonProps) => {
  const {
    className,
    ...otherProps
  } = props

  return (
    <StyledIconButton
      className={clsx(colorClass, className)}
      {...otherProps}
    >
      <IconComponent/>
    </StyledIconButton>
  )
}

export const AddButton = createIconButton(AddIcon, 'green')
export const CheckButton = createIconButton(CheckIcon, 'green')
export const CloseButton = createIconButton(CloseIcon, 'red')
