import React from 'react'
import {connect} from 'react-redux'
import {selectedCountriesSelector} from '../../redux/modules/countries'
import CountryCard from './CountryCard'

const SelectedCountriesList = ({selectedCountries}) => {
  return <React.Fragment>
    <h3>Selected countries</h3>
    {
      selectedCountries && selectedCountries.map(i => <CountryCard item={i} key={i.id} />)
    }
  </React.Fragment>
}

export default connect(state => ({
  selectedCountries: selectedCountriesSelector(state)
}))(SelectedCountriesList)