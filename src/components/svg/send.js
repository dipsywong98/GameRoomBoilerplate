/**
* Generated on 2018-06-06T10:03:20.114Z
*/
import React from 'react'
import PropTypes from 'prop-types'

const send = ({ size = 18, color }) => (
  <svg
    t='1505999463312'
    viewBox='0 0 24 24'
    version='1.1' xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}>
    <path
      fill={color}
      className='send'
      d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' />
    <path
      fill='none'
      className='send'
      d='M0 0h24v24H0z' />

  </svg>
)
send.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
}
export default send
