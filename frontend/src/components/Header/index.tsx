import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import clsx from 'clsx'
import Logo from './Logo'
import { AddButton } from '../buttons'
import { createHashRouteHandler } from '../../utils/router'

const HeaderRoot = styled.div`
height: 60px;

>.header-body {
  position: fixed;
  top: 0;
  left: 0;
  height: inherit;
  width: 100%;
  background-color: lightskyblue;

  >.header-content {
    box-sizing: border-box;
    height: inherit;
    witdh: inherit;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 10px;
    display: flex;
    align-items: center;

    >.add-todo-button {
      margin-left: auto;
    }
  }
}
`

interface HeaderProps {
  className?: string
}

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  const {
    className,
  } = props

  const location = useLocation()

  return (
    <HeaderRoot
      className={clsx('header-root', className)}
    >
      <div className='header-body'>
        <div className='header-content'>
          <Logo />
          {
            location.pathname === '/' &&
            <AddButton
              className='add-todo-button'
              onClick={createHashRouteHandler('/add')}
            />
          }
        </div>
      </div>
    </HeaderRoot>
  )
}

export default Header
