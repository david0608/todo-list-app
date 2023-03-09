import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import Paper from '@material-ui/core/Paper'
import type { Priority } from '../../../common/types'

function priorityClass(p: Priority): string {
  switch (p) {
    case 3:
      return 'critical'
    case 2:
      return 'normal'
    case 1:
      return 'low'
    default:
      return ''
  }
}

function priorityText(p: Priority): string {
  switch (p) {
    case 3:
      return 'Critical'
    case 2:
      return 'Normal'
    case 1:
      return 'Low'
    default:
      return ''
  }
}

const StyledPaper = styled(Paper)`
user-select: none;

&.MuiPaper-root {
  color: white;
  border: none;
  padding: 0 4px;

  &.critical {
    background-color: gold;
  }

  &.normal {
    background-color: darkseagreen;

  }

  &.low {
    background-color: powderblue;
  }
}
`

interface PriorityLabelProps {
  className?: string
  priority: Priority
}

const PriorityLabel: React.FC<PriorityLabelProps> = (props) => {
  const {
    className,
    priority,
  } = props

  return (
    <StyledPaper
      className={clsx(priorityClass(priority), className)}
      variant='outlined'
    >
      {priorityText(priority)}
    </StyledPaper>
  )
}

export default PriorityLabel
