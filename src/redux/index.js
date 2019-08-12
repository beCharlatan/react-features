import {createStore, applyMiddleware} from 'redux'
import rootReducer
  from "./reducers";
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {rootSaga} from './saga'

const sagaMiddleware = createSagaMiddleware()
const enhancer = applyMiddleware(sagaMiddleware, thunk, logger)

const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export default store