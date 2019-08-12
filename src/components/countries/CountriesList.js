import React from 'react'
import {connect} from 'react-redux'
import {fetchAll, countriesSelector, moduleName, selectCountry} from '../../redux/modules/countries'
import Loader from '../common/Loader'

const CountriesList = ({countries, fetchAll, loading, selectCountry}) => {

  React.useEffect(() => {
    fetchAll()
  }, [])

  const handleRowClick = (id) => () => selectCountry(id)

  const getRow = ({id, country, usual_passport}) => {
    return <tr key={id} onClick={handleRowClick(id)}>
      <td>{country}</td>
      <td>{usual_passport}</td>
    </tr>
  }
  const getRows = () => countries.map(getRow) 

  return <React.Fragment>
    <h3>This is countries list</h3>
    {loading && <Loader />}
    <table>
      <tbody>
        {getRows()}
      </tbody>
    </table>
  </React.Fragment>
}

export default connect(state => ({
  countries: countriesSelector(state),
  loading: state[moduleName].loading
}), {
  fetchAll,
  selectCountry
})(CountriesList)