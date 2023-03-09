import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const StyledIconButton = styled(IconButton)`
&.MuiIconButton-root {
  color: white;

  &.MuiIconButton-sizeSmall {
    padding: 4px;
    
    .MuiSvgIcon-root {
      font-size: 1.2rem;
    }
}
}

&, &:hover {
  &.green {
    background-color: lightgreen;
  }

  &.red {
    background-color: lightcoral;
  }

  &.gray {
    background-color: lightgray;
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
export const EditButton = createIconButton(EditIcon, 'gray')
export const DeleteButton = createIconButton(DeleteIcon, 'gray')
