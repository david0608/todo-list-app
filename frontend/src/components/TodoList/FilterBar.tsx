import React, { useState } from 'react'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { actions } from '../../store/todoList'
import Input from '../common/Input'
import type { Priority } from '../../common/types'

type PriorityStr = 'critical' | 'normal' | 'low' | 'all'

function mapPriorityFilterOptionToStr(option: Priority | undefined): PriorityStr {
  switch (option) {
    case 3:
      return 'critical'
    case 2:
      return 'normal'
    case 1:
      return 'low'
    default:
      return 'all'
  }
}

function mapPriorityStrToFilterOption(str: PriorityStr): Priority | undefined {
  switch (str) {
    case 'critical':
      return 3
    case 'normal':
      return 2
    case 'low':
      return 1
    default:
      return undefined
  }
}

const priorityOptions: { label: string, value: PriorityStr }[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Critical',
    value: 'critical',
  },
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Low',
    value: 'low',
  },
]

type DoneStr = 'done' | 'notDone' | 'all'

function mapDoneFilterOptionToStr(option: boolean | undefined): DoneStr {
  switch (option) {
    case true:
      return 'done'
    case false:
      return 'notDone'
    default:
      return 'all'
  }
}

function mapDoneStrToFilterOption(str: DoneStr): boolean | undefined {
  switch (str) {
    case 'done':
      return true
    case 'notDone':
      return false
    default:
      return undefined
  }
}

const doneOptions: { label: string, value: DoneStr }[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Done',
    value: 'done',
  },
  {
    label: 'Not done',
    value: 'notDone',
  },
]

const StyledDiv = styled.div`
display: flex;

>*:first-child {
  flex: 2;
}

>*:not(:first-child) {
  margin-left: 10px;
  flex: 1;
}
`

const FilterBar = () => {
  const filterOptions = useAppSelector(state => state.todoList.filterOptions)
  const dispatch = useAppDispatch()

  const [searchText, setSearchText] = useState(filterOptions.search)

  const handleSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchText(e.target.value)
  }

  const handleSearchInputKeyPress: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      dispatch(actions.updateSearch(searchText))
    }
  }

  const handleDoneStatusSelectChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(actions.updateDoneFilter(mapDoneStrToFilterOption(e.target.value as DoneStr)))
  }

  const handlePrioritySelectChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(actions.updatePriorityFilter(mapPriorityStrToFilterOption(e.target.value as PriorityStr)))
  }

  return (
    <StyledDiv>
      <Input
        label='Search'
        placeholder='Title'
        defaultValue={filterOptions.search}
        onChange={handleSearchInputChange}
        onKeyPress={handleSearchInputKeyPress}
        size='small'
      />
      <Input
        select
        label='Done status'
        value={mapDoneFilterOptionToStr(filterOptions.done)}
        onChange={handleDoneStatusSelectChange}
        size='small'
      >
        {doneOptions.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Input>
      <Input
        select
        label='Priority'
        value={mapPriorityFilterOptionToStr(filterOptions.priority)}
        onChange={handlePrioritySelectChange}
        size='small'
      >
        {priorityOptions.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Input>
    </StyledDiv>
  )
}

export default FilterBar
