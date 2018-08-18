/**
* Generated on 2018-06-03T14:31:05.057Z
*/
import React from 'react'
import PropTypes from 'prop-types'

const edit = ({ size = 18, color }) => (
  <svg
    t='1505999463312'
    viewBox='0 0 24 24'
    version='1.1' xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}>
    <defs>
      <style type='text/css'>{'undefined'}</style>
    </defs>
    <path
      fill={color}
      className='edit'
      d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
    <path
      fill={'none'}
      className='edit'
      d='M0 0h24v24H0z' />

  </svg>
)
edit.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
}
export default edit
