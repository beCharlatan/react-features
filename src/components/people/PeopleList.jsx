import React from 'react'
import {connect} from 'react-redux'
import {fetchPeople, moduleName, peopleSelector} from '../../redux/modules/people'
import Loader from '../common/Loader'
import {List} from 'react-virtualized'
import PeopleCard from './PeopleCard'

const PeopleList = ({people, fetchPeople, loading}) => {

  React.useEffect(() => {
    fetchPeople()
  }, [])

  const rowRenderer = ({key, index}) => {
    return <PeopleCard key={key} item={people[index]} />
  }

  return <React.Fragment>
    <h3>This is people list</h3>
    {loading && <Loader />}
    <List
      width={600}
      height={250}
      rowCount={people.length}
      rowHeight={60}
      rowRenderer={rowRenderer}
    />
  </React.Fragment>
}

export default connect(state => ({
  people: peopleSelector(state),
  loading: state[moduleName].loading,
}), {
  fetchPeople
})(PeopleList)