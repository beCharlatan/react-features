import {combineReducers} from "redux"
import {reducer as form}
  from "redux-form";
import authReducer, {moduleName as authModule} from '../redux/modules/auth'
import peopleReducer, {moduleName as peopleModule} from '../redux/modules/people'
import countriesReducer, {moduleName as countriesModule} from '../redux/modules/countries'

const rootReducer = combineReducers({
  form,
  [authModule]: authReducer,
  [peopleModule]: peopleReducer,
  [countriesModule]: countriesReducer
})

export default rootReducer