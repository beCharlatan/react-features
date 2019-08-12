import React from 'react'
import {connect}
  from "react-redux";
import {NavLink, Route} from 'react-router-dom'
import SigninForm
  from "../auth/SigninForm";
import SignupForm
  from "../auth/SignupForm";
import {signUp, signIn, moduleName} from '../../redux/modules/auth'
import Loader
  from "../common/Loader";


const AuthPage = ({loading, signUp, signIn}) => {

  const handleSignin = () => ({email, pass}) => signIn(email, pass)
  const handleSignup = () => ({email, pass}) => signUp(email, pass)

  return <div>
    <h1>Auth page</h1>
    <NavLink to="/auth/signin" activeStyle={{color: 'red'}}>Sign in</NavLink>
    <NavLink to="/auth/signup" activeStyle={{color: 'red'}}>Sign up</NavLink>
    <Route path="/auth/signin"
           render={() => <SigninForm onSubmit={handleSignin()}/>} />
    <Route path="/auth/signup"
           render={() => <SignupForm onSubmit={handleSignup()}/>} />
    {loading && <Loader />}
  </div>
}

export default connect(state => ({
  loading: state[moduleName].loading
}), {signUp, signIn})(AuthPage)