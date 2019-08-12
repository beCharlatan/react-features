import 'babel-polyfill'
import firebase from 'firebase'
import {createSelector} from 'reselect'
import {Record, List} from 'immutable'
import {appName} from '../../config'
import {eventChannel} from 'redux-saga'
import {put, takeEvery, call, select, spawn, delay, all,take} from 'redux-saga/effects'
import {fromDatabaseToStore} from '../../utils'

export const moduleName = 'people'

export const ADD_PEOPLE_REQUEST = `${appName}/${moduleName}/ADD_PEOPLE_REQUEST`
export const ADD_PEOPLE_SUCCESS = `${appName}/${moduleName}/ADD_PEOPLE_SUCCESS`
export const ADD_PEOPLE_ERROR = `${appName}/${moduleName}/ADD_PEOPLE_ERROR`
export const FETCH_ALL_REQUEST = `${appName}/${moduleName}/FETCH_ALL_REQUEST`
export const FETCH_ALL_SUCCESS = `${appName}/${moduleName}/FETCH_ALL_SUCCESS`
export const ADD_EVENT_REQUEST = `${appName}/${moduleName}/ADD_EVENT_REQUEST`
export const ADD_EVENT_SUCCESS = `${appName}/${moduleName}/ADD_EVENT_SUCCESS`
export const REMOVE_PEOPLE_REQUEST = `${appName}/${moduleName}/REMOVE_PEOPLE_REQUEST`
export const REMOVE_PEOPLE_SUCCESS = `${appName}/${moduleName}/REMOVE_PEOPLE_SUCCESS`

const ReducerRecord = Record({
  loading: false,
  people: new List([]),
  error: null
})

const PersonRecord = Record({
  id: null,
  name: null,
  surname: null,
  targetToGo: []
})

export const stateSelector = state => state[moduleName]
export const peopleImuttableSelector = createSelector(stateSelector, state => state.people)
export const peopleSelector = createSelector(peopleImuttableSelector, people => {
  return people.valueSeq().toArray()
})

export default function reducer(state = new ReducerRecord(), action) {
  const {type, payload} = action

  switch (type) {
    case ADD_PEOPLE_REQUEST:
    case REMOVE_PEOPLE_REQUEST:
    case FETCH_ALL_REQUEST:
      return state
        .set('loading', true)
    case ADD_PEOPLE_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['people', payload.id], new PersonRecord(payload))
    case REMOVE_PEOPLE_SUCCESS:
      return state
        .set('loading', false)
        .deleteIn(['people', payload])
    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('people', fromDatabaseToStore(payload, PersonRecord))
    case ADD_EVENT_SUCCESS:
      return state
        .setIn(['people', payload.personId, 'targetToGo'], payload.countries)
    case ADD_PEOPLE_ERROR:
      return state
        .set('loading', false)
        .set('error', payload.e)
    default:
      return state
  }
}

// экшн для использования компонентами
export const addPeople = (name, surname) => {
  const person = {
    name, surname
  }
  return {
    type: ADD_PEOPLE_REQUEST,
    payload: person
  }
}

export const fetchPeople = () => ({
  type: FETCH_ALL_REQUEST
})

export const removePeople = (id) => ({
  type: REMOVE_PEOPLE_REQUEST,
  payload: id
})

export const addEventToPerson = ({personId, countryId}) => ({
  type: ADD_EVENT_REQUEST,
  payload: {personId, countryId}
})

// сага для сайд-эффектов, которая обрабатывает всю логику приложения
// для выполнения саги существуют команды - эффекты, которые разработаны в redux-saga
// например put - аналог dispatch, который отправляет экшн, с обновленными или дополненными данными, которые пришли, например, с сервера и т.д.
export const addPeopleSaga = function* (action) {
  const ref = firebase.database().ref('people')
  yield call([ref, ref.push], action.payload)
  yield put({
    type: ADD_PEOPLE_SUCCESS,
    payload: {...action.payload, id: ref.key}
  })
}

export const addEventToPersonSaga = function* (action) {
  const {personId, countryId} = action.payload
  const countriesRef = firebase.database().ref(`/people/${personId}/targetToGo`)
  const state = yield select(stateSelector)
  const countries = state.getIn(['people', personId, 'targetToGo']).concat(countryId)
  try {
    yield call([countriesRef, countriesRef.set], countries)
    yield put({
      type: ADD_EVENT_SUCCESS,
      payload: {
        personId,
        countries
      }
    })
  } catch (_) {}
}

export const fetchPeopleSaga = function* () {
  const ref = firebase.database().ref('people')
  try {
    const data = yield call([ref, ref.once], 'value')
    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()
    })
  } catch (_) {}
}

export const removePeopleSaga = function* (action) {
  const ref = firebase.database().ref(`people/${action.payload}`)
  
  try {
    yield call([ref, ref.remove])
    yield put({
      type: REMOVE_PEOPLE_SUCCESS,
      payload: action.payload
    })
  } catch (_) {}
}

export const backgroundSyncSaga = function* () {
  while (true) {
    yield call(fetchPeopleSaga)
    yield delay(60000)
  }
}

export const createPeopleSocket = () => eventChannel(emit => {
  const ref = firebase.database().ref('people')
  const cb = (data) => emit({data})
  ref.on('value', cb)

  return () => ref.off('value', cb)
})

// export const realtimeSaga = function* () {
//   const ch = yield call(createPeopleSocket)
//   try {
//     while (true) {
//       const {data} = yield take(ch)
//       yield put({
//         type: FETCH_ALL_SUCCESS,
//         payload: data.val()
//       })
//     }
//   } finally {
//     yield call([ch, ch.close])
//   }
// }

// общая сага которая регистрирует локальные саги и даёт им "расписание", т.е. при каких условиях она должна выполняться
// например, при вызове экшна
export const saga = function* () {
  //yield spawn(realtimeSaga)
  yield spawn(backgroundSyncSaga)
  yield all([
    yield takeEvery(ADD_PEOPLE_REQUEST, addPeopleSaga),
    yield takeEvery(FETCH_ALL_REQUEST, fetchPeopleSaga),
    yield takeEvery(ADD_EVENT_REQUEST, addEventToPersonSaga),
    yield takeEvery(REMOVE_PEOPLE_REQUEST, removePeopleSaga)
  ])
}