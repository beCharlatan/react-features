import 'babel-polyfill'
import firebase from 'firebase'
import {call, put, all, take, select} from 'redux-saga/effects'
import {appName} from '../../config'
import {Record, List, OrderedSet} from 'immutable'
import {createSelector} from 'reselect'

export const moduleName = 'countries'

export const FETCH_ALL_REQUEST = `${appName}/${moduleName}/FETCH_ALL_REQUEST`
export const FETCH_ALL_SUCCESS = `${appName}/${moduleName}/FETCH_ALL_SUCCESS`
export const SELECT_COUNTRY = `${appName}/${moduleName}/SELECT_COUNTRY`
export const FETCH_LAZY_START = `${appName}/${moduleName}/FETCH_START_START`
export const FETCH_LAZY_REQUEST = `${appName}/${moduleName}/FETCH_LAZY_REQUEST`
export const FETCH_LAZY_SUCCESS = `${appName}/${moduleName}/FETCH_LAZY_SUCCESS`

const ReducerRecord = Record({
  loading: false,
  loaded: false,
  entities: new List([]),
  selected: new OrderedSet([])
})

export default function countriesReducer(state = new ReducerRecord(), action) {
  const {type, payload} = action

  switch (type) {
    case FETCH_ALL_REQUEST:
    case FETCH_LAZY_START:
      return state
        .set('loading', true)
    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', new List(payload))
    case FETCH_LAZY_SUCCESS:
      return state
        .set('loading', false)
        .mergeIn(['entities'], new List(payload))
        .set('loaded', payload.length < 20)
    case SELECT_COUNTRY:
      return state.selected.contains(payload) 
        ? state.update('selected', selected => selected.remove(payload))
        : state.update('selected', selected => selected.add(payload))
    default:
      return state
  }
}

export const stateSelector = state => state[moduleName]
export const entitiesSelector = createSelector(stateSelector, state => state.entities)
export const countriesSelector = createSelector(entitiesSelector, entities => entities.toJS())
export const selectedSelector = createSelector(stateSelector, state => state.selected)
export const selectedCountriesSelector = createSelector(entitiesSelector, selectedSelector, (entities, selection) => {
  return entities.size > 0 ? selection.toArray().map(i => entities.get(i - 1)) : []
})
export const fetchAll = () => ({
  type: FETCH_ALL_REQUEST
})

export const fetchLazy = () => ({
  type: FETCH_LAZY_REQUEST
})

export const selectCountry = (id) => ({
  type: SELECT_COUNTRY,
  payload: id
})

export const fetchAllSaga = function* () {
  const ref = firebase.database().ref(`countries`)
  while (true) {
    yield take(FETCH_ALL_REQUEST)
    try {
      const data = yield call([ref, ref.once], 'value')
      yield put({
        type: FETCH_ALL_SUCCESS,
        payload: data.val()
      })
    } catch (_) {}
  }
}

export const fetchLazySaga = function* () {
  while (true) {
    yield take(FETCH_LAZY_REQUEST)
    const state = yield select(stateSelector)
    if (state.loading && state.loaded) continue;
    yield put({
      type: FETCH_LAZY_START
    })
    const lastItem = state.entities.last()
    const ref = firebase.database().ref(`countries`)
      .orderByKey()
      .limitToFirst(20)
      .startAt(lastItem ? lastItem.id.toString() : '0');
    const data = yield call([ref, ref.once], 'value')
    const formattedData = yield data.val() ? (Array.isArray(data.val()) 
        ? data.val().filter(i => i)
        : Object.values(data.val()))
      : [];
    yield put({
      type: FETCH_LAZY_SUCCESS,
      payload: formattedData
    })
  }
}

export const saga = function* () {
  yield all([
    fetchAllSaga(),
    fetchLazySaga()
  ])
}