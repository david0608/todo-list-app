import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import clsx from 'clsx'
import Logo from './Logo'
import { AddButton } from '../buttons'
import { createHashRouteHandler } from '../../../common/utils'

const HeaderRoot = styled.div`
position: relative;
height: 60px;
z-index: 1000;

>.header-body {
  position: fixed;
  top: 0;
  left: 0;
  height: inherit;
  width: 100vw;
  background-color: deepskyblue;

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
      background-color: transparent;

      .MuiSvgIcon-root {
        font-size: 35px;
      }
    }
  }
}
`

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = (props) => {
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
