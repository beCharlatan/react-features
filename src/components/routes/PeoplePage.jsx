import React from 'react'
import {connect} from 'react-redux'
import {addPeople, moduleName} from '../../redux/modules/people'
import EditPeopleForm from '../people/EditPeopleForm'
import {change, untouch} from 'redux-form'
import PeopleList from '../people/PeopleList'
import PeopleTrash from '../people/PeopleTrash'

const PeoplePage = ({addPeople, loading, change, untouch}) => {

  const handleAddPeople = () => ({name, surname}) => {
    const fields = ['name', 'surname']
    for (let i = 0; i < fields.length; i++) {
      change('people', fields[i], null)
      untouch('people', fields[i])
    }
    addPeople(name, surname)
  }

  return <div>
    <PeopleTrash />
    <PeopleList />
    {!loading && <React.Fragment>
      Edit People
      <EditPeopleForm onSubmit={handleAddPeople()} />
    </React.Fragment>}
  </div>
}

export default connect(state => ({
  loading: state[moduleName].loading
}), {addPeople, change, untouch})(PeoplePage)