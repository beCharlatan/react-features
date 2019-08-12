import React from 'react'
import {Link} from 'react-router-dom'

const UnAuthorized = () => {
  return <h2>Oops! u're not authorized! please,
    <Link to="/auth/signin">Sign in</Link></h2>
}

export default UnAuthorized