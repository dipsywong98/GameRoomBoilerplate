/**
* Generated on 2018-06-03T14:32:02.148Z
*/
import React from 'react'
import PropTypes from 'prop-types'

const Clear = ({ size = 18, color }) => (
  <svg
    t='1505999463312'
    viewBox='0 0 24 24'
    version='1.1' xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}>
    <path
      fill={color}
      className='Clear'
      d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    <path
      fill={'none'}
      className='Clear'
      d='M0 0h24v24H0z' />

  </svg>
)
Clear.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
}
export default Clear
