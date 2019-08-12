import React from 'react'
import {connect} from 'react-redux'
import {removePeople} from '../../redux/modules/people'
import {DropTarget} from 'react-dnd'

function PeopleTrash({dropTarget, canDrop, hovered}) {

  const dropTargetStyle = {
    backgroundColor: hovered ? 'red' : canDrop ? 'pink' : ''
  }
  
  return dropTarget(
    <div style={{...dropTargetStyle}}>
      <h1>TRASH</h1>
    </div>
  )
}

const spec = {
  drop(props, monitor) {
    const personId = monitor.getItem().id;
    props.removePeople(personId)
  }
}

const collect = (connect, monitor) => ({
  dropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  hovered: monitor.isOver()
})

export default connect((state, props) => ({}), {
  removePeople
})(DropTarget(['person'], spec, collect)(PeopleTrash))
