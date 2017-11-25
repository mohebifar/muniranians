import styled from 'styled-components'
import {
  space,
  width,
  fontSize,
  color,
  flexDirection,
  flexWrap,
} from 'styled-system'

export const Container = styled.div`
  ${props =>
    props.flex
      ? `display: flex; flex-direction: ${props.flex};`
      : null} ${props =>
      props.fluid ? null : 'max-width: 960px; margin: auto;'};
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`

export const Box = styled.div`
  ${space} ${width} ${fontSize} ${color};
`

export const Flex = styled.div`
  display: flex;
  ${flexDirection} ${flexWrap};
`

export const Panel = styled.div`
  padding: 15px;
  background: #ffffff;
  box-shadow: 0 0 29px rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  border: 1px solid #eaeaea;
`
