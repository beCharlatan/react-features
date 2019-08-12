import {OrderedMap, Map} from 'immutable'

export const generateId = () => {
  return Date.now()
}

export const fromDatabaseToStore = (data, RecordModel = Map) => {
  return new OrderedMap(data).mapEntries(([id, value]) => (
    [id, (new RecordModel(value)).set('id', id)]
  ))
}
