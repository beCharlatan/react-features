import React from 'react'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import {moduleName} from '../../redux/modules/auth'
import UnAuthorized
  from "./UnAuthorized";

const ProtectedRoute = ({component, path, authorized, ...rest}) => {

  const protectedRender = ({routeProps}) => {
    const ProtectedComponent = component
    return authorized ? <ProtectedComponent {...routeProps} /> : <UnAuthorized/>
  }

  return <Route path={path} render={protectedRender} {...rest} />
}

export default connect(state => ({
  authorized: !!state[moduleName].user
}))(ProtectedRoute)