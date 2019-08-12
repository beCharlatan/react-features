import React from 'react'

const ErrorField = ({input, type, meta: {touched, error}}) => {
  const errorText = error && <span style={{color: 'red'}}>{error}</span>;
  return <React.Fragment>
    <label
      htmlFor={input.id}>{input.name}</label>
    <input
      {...input}
      type={type}/>
    {touched && errorText}
  </React.Fragment>
}

export default ErrorField