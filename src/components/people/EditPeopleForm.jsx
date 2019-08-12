import React from 'react'
import { reduxForm, Field } from 'redux-form'
import ErrorField from '../common/ErrorField'

const EditPeopleForm = ({handleSubmit}) => {
  return <div>
    <form onSubmit={handleSubmit}>
      <div>
        <Field name="name" id="name" component={ErrorField} />
      </div>
      <div>
        <Field name="surname" id="surname" component={ErrorField} />
      </div>
      <div>
        <input
          type="submit" />
      </div>
    </form>
  </div>
}

const validate = (name, surname) => {
  const errors = {}

  if (!name) errors.name = 'name is required'
  if (!surname) errors.surname = 'surname is required'

  return errors
}

export default reduxForm({
  form: 'people',
  validate
})(EditPeopleForm)