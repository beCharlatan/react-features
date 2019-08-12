import React from 'react'
import {reduxForm, Field} from 'redux-form'

const SigninForm = ({handleSubmit}) => {
  return <React.Fragment>
    <h2>Sign in</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email">Email</label>
        <Field name="email" id="email" component="input" />
      </div>
      <div>
        <label
          htmlFor="pass">Password</label>
        <Field name="pass" id="pass" component="input" type="password" />
      </div>
      <div>
        <input
          type="submit"/>
      </div>
    </form>
  </React.Fragment>
}

export default reduxForm({
  form: 'auth'
})(SigninForm)