import {all} from 'redux-saga/effects'
import {saga as peopleSaga} from '../redux/modules/people'
import {saga as authSaga} from '../redux/modules/auth'
import {saga as coutriesSaga} from '../redux/modules/countries'

export const rootSaga = function* () {
  yield all([
    authSaga(),
    coutriesSaga(),
    peopleSaga()
  ])
}