import 'babel-polyfill'
import firebase from "firebase"
import {appName} from '../../config'
import {Record} from 'immutable'
import {eventChannel} from 'redux-saga'
import {all, take, put, call, takeEvery, spawn} from 'redux-saga/effects'

export const moduleName = 'auth'
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`
export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`
export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`

const ReducerRecord = Record({
  loading: false,
  user: null,
  error: null
})

export default function authReducer(state = new ReducerRecord(), action) {
  const {type, payload} = action

  switch (type) {
    case SIGN_UP_REQUEST, SIGN_IN_REQUEST:
      return state
        .set('loading', true)
    case SIGN_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('user', payload)
    case SIGN_UP_ERROR, SIGN_IN_ERROR:
      return state
        .set('loading', false)
        .set('error', payload.e)
    case SIGN_OUT_SUCCESS:
      return new ReducerRecord()
    default:
      return state
  }
}

export const signUp = (email, pass) => {
  return {
    type: SIGN_UP_REQUEST,
    payload: {email, pass}
  }
}

export const signIn = (email, pass) => {
  return {
    type: SIGN_IN_REQUEST,
    payload: {email, pass}
  }
}

export const signOut = () => {
  return {
    type: SIGN_OUT_REQUEST
  }
}

export const signOutSaga = function * () {
  const authContext = firebase.auth()
  try {
    yield call([authContext, authContext.signOut])
  } catch (_) {}
}

export const signInSaga = function* () {
  const authContext = firebase.auth()

  while (true) {
    const action = yield take(SIGN_IN_REQUEST)
    try {
      yield call([authContext, authContext.signInWithEmailAndPassword], 
        action.payload.email, action.payload.pass)
    } catch (err) {
      yield put({
        type: SIGN_IN_ERROR,
        err
      })
    }
  }
}

export const signUpSaga = function* () {
  const authContext = firebase.auth()
  while (true) {
    const action = yield take(SIGN_UP_REQUEST)
    try {
      yield call([authContext, authContext.createUserWithEmailAndPassword], 
        action.payload.email, action.payload.pass)
    } catch (err) {
      yield put({
        type: SIGN_UP_ERROR,
        err
      })
    }
  }
}

export const authStatusSocket = () => eventChannel(emit => {
  const ref = firebase.auth()
  const cb = (data) => emit({data})
  return ref.onAuthStateChanged(cb)
})

export const authStatusSaga = function* () {
  const ch = yield call(authStatusSocket)
  try {
    while (true) {
      const {data} = yield take(ch)
      if (data) {
        yield put({
          type: SIGN_IN_SUCCESS,
          payload: data
        })
      } else {
        yield put({
          type: SIGN_OUT_SUCCESS
        })
      }
    }
  } finally {
    yield call([ch, ch.close])
  }
}

export const saga = function* () {
  yield spawn(authStatusSaga)
  yield all([
    takeEvery(SIGN_OUT_REQUEST, signOutSaga),
    signUpSaga(),
    signInSaga()
  ])
}