import React from 'react'
import {reduxForm, Field} from 'redux-form'
import ErrorField
  from "../common/ErrorField";

const SignupForm = ({handleSubmit}) => {
  return <React.Fragment>
    <h2>Sign up</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <Field name="email" id="email" component={ErrorField} />
      </div>
      <div>
        <Field name="pass" id="pass" component={ErrorField} type="password" />
      </div>
      <div>
        <input
          type="submit"/>
      </div>
    </form>
  </React.Fragment>
}

const validate = ({email, pass}) => {
  const errors = {}

  if (!email) errors.email = 'email is required';

  if (!pass) errors.pass = 'pass is required';
  else if (pass.length < 4) errors.pass = 'password is too short';

  return errors
}

export default reduxForm({
  form: 'auth',
  validate
})(SignupForm)