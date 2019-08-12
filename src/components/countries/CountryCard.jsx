import React from 'react'
import {connect} from 'react-redux'
import {addEventToPerson, peopleSelector} from '../../redux/modules/people'
import {DropTarget} from 'react-dnd'

function CountryCard({item, dropTarget, canDrop, hovered, visitors}) {
  const {country, dip_passport, gov_passport, usual_passport} = item
  const dropTargetStyle = {
    backgroundColor: hovered ? 'green' : canDrop ? 'lightgreen' : ''
  }
  const visitorsList = visitors && 
    (<p>{visitors.map(i => i.name).join(', ')}</p>);
  
  return dropTarget(
    <div style={{...dropTargetStyle}}>
      <h2>{country}</h2>
      <p>For diplomats: {dip_passport}</p>
      <p>For official: {gov_passport}</p>
      <p>For others: {usual_passport}</p>
      {visitorsList}
    </div>
  )
}

const spec = {
  drop(props, monitor) {
    const personId = monitor.getItem().id;
    const countryId = props.item.id - 1;
    props.addEventToPerson({personId, countryId})
    return {countryId}
  }
}

const collect = (connect, monitor) => ({
  dropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  hovered: monitor.isOver()
})

export default connect((state, props) => ({
  visitors: peopleSelector(state).filter(i => i.targetToGo.includes(props.item.id - 1))
}), {
  addEventToPerson
})(DropTarget(['person'], spec, collect)(CountryCard))
