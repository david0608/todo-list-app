import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { actions } from '../../store/todoList'
import type { SortKey } from '../../common/types'

const StyledDiv = styled.div`
display: flex;
align-items: center;

>.created-at-label, >.updated-at-label, >.priority-label {
  cursor: pointer;
  user-select: none;
  position: relative;

  >.MuiSvgIcon-root {
    position: absolute;
    font-size: 18px;
    margin-left: 5px;
  }
}

>.created-at-label {
  margin-left: auto;
  margin-right: 63px;
}

>.updated-at-label {
  margin-right: 85px;
}

>.priority-label {
  margin-right: 30px;
}
`

interface SortBarProps {
  className?: string
}

const SortBar: React.FC<SortBarProps> = (props) => {
  const {
    className,
  } = props

  const filterOptions = useAppSelector(state => state.todoList.filterOptions)
  const dispatch = useAppDispatch()

  const createLabelClickHandler = (key: SortKey) => () => {
    dispatch(actions.updateSortKey({ sortKey: key, reverse: filterOptions.sortKey === key ? !filterOptions.reverse : false}))
  }

  return (
    <StyledDiv className={clsx('font-size-1', 'font-color-gray', className)}>
      <div className='done-status-label'>
        Done status
      </div>
      <div
        className='created-at-label'
        onClick={createLabelClickHandler('created_at')}
      >
        Created at
        { filterOptions.sortKey === 'created_at' && <ArrowIcon upward={filterOptions.reverse} />}
      </div>
      <div
        className='updated-at-label'
        onClick={createLabelClickHandler('updated_at')}
      >
        Updated at
        { filterOptions.sortKey === 'updated_at' && <ArrowIcon upward={filterOptions.reverse} />}
      </div>
      <div
        className='priority-label'
        onClick={createLabelClickHandler('priority')}
      >
        Priority
        { filterOptions.sortKey === 'priority' && <ArrowIcon upward={filterOptions.reverse} />}
      </div>
    </StyledDiv>
  )
}

export default SortBar

const ArrowIcon = (props: { upward: boolean }) => props.upward ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
