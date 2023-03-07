import React from 'react'
import styled from 'styled-components'

const TestScrollRoot = styled.div`
height: 3000px;
`

interface TestScrollProps {
  content: string
}

const TestScroll: React.FunctionComponent<TestScrollProps> = (props) => {
  const {
    content,
  } = props

  return (
    <TestScrollRoot>
      {content}
    </TestScrollRoot>
  )
}

export default TestScroll
