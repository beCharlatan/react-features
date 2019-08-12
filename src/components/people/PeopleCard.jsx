import React from 'react'
import {DragSource} from 'react-dnd'

function PeopleCard({item, connectDragSource, isDragging}) {
  const dragStyle = {
    backgroundColor: isDragging ? 'grey' : ''
  }
  const {name, surname} = item
  return connectDragSource(
    <div style={{...dragStyle}}>
      <h2>{name} {surname}</h2>
    </div>
  )
}

const spec = {
  beginDrag(props) {
    return {
      id: props.item.id
    }
  },
  endDrag(props, monitor) {
    const personId = props.item.id
    const dropToTarget = monitor.getDropResult()
    const countryId = dropToTarget && dropToTarget.countryId
  }
}

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})

export default DragSource('person', spec, collect)(PeopleCard)
