import React from 'react'
import PeopleList from '../people/PeopleList'
import VirtualizedCountriesList from '../countries/VirtualizedCountriesList'
import SelectedCountriesList from '../countries/SelectedCountriesList'
import PeopleTrash from '../people/PeopleTrash'

const AdminPage = () => {
  return <div>
    <PeopleTrash />
    <PeopleList />
    <SelectedCountriesList />
    <VirtualizedCountriesList />
  </div>
}

export default AdminPage