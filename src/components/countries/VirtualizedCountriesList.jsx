import React from 'react'
import {connect} from 'react-redux'
import {fetchLazy, countriesSelector, moduleName, selectCountry} from '../../redux/modules/countries'
import Loader from '../common/Loader'
import {Table, Column, InfiniteLoader} from 'react-virtualized'

const VirtualizedCountriesList = ({countries, fetchLazy, selectCountry, loaded}) => {

  React.useEffect(() => {
    fetchLazy()
  }, [])

  const handleRowClick = ({rowData}) => selectCountry(rowData.id)

  const getRow = ({index}) => {
    return countries[index]
  }

  const isRowLoaded = ({index}) => index < countries.length

  const loadMoreRows = () => {
    fetchLazy()
  }

  return <React.Fragment>
    <h3>This is countries list</h3>
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={loaded ? countries.length : countries.length + 1}
    >
      {({onRowsRendered, registerChild}) => <Table
      rowCount={countries.length}
      overscanColumnCount={5}
      ref={registerChild}
      onRowsRendered={onRowsRendered}
      rowGetter={getRow}
      rowHeight={50}
      headerHeight={75}
      width={600}
      height={500}
      onRowClick={({rowData}) => handleRowClick({rowData})}
    >
      <Column
        label="Country"
        dataKey="country"
        width={250}
      />
      <Column
        label="Passport"
        dataKey="usual_passport"
        width={350}
      />
    </Table>}
    </InfiniteLoader>
  </React.Fragment>
}

export default connect(state => ({
  countries: countriesSelector(state),
  loading: state[moduleName].loading,
  loaded: state[moduleName].loaded
}), {
  fetchLazy,
  selectCountry
})(VirtualizedCountriesList)