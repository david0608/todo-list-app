import React from 'react'
import styled from 'styled-components'
import { createHashRouteHandler } from '../../../common/utils'

const LogoRoot = styled.div`
  font-size: 40px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`

const Logo: React.FC = () => {
  return (
    <LogoRoot
      onClick={createHashRouteHandler('/')}
    >
      Todo
    </LogoRoot>
  )
}

export default Logo
