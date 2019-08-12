import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Link, NavLink} from 'react-router-dom'
import AuthPage
  from "./routes/AuthPage";
import AdminPage
  from "./routes/AdminPage";
import ProtectedRoute
  from "./common/ProtectedRoute";
import PeoplePage from './routes/PeoplePage'
import CountriesPage from './routes/CountriesPage'
import {signOut, moduleName} from '../redux/modules/auth'


const App = ({signedIn, signOut}) => {

  const coreBtn = signedIn ? 
    <button onClick={() => signOut()}>Sing out</button> :
    <Link to="/auth/signin">Sing in</Link>

  return <Router>
    {coreBtn}
    <NavLink to="/auth">Authentication</NavLink>
    <NavLink to="/admin">Admin page</NavLink>
    <NavLink to="/countries">Countries page</NavLink>
    <NavLink to="/people">Edit people</NavLink>
    <Route path="/auth" component={AuthPage} />
    <Route path="/people" component={PeoplePage} />
    <Route path="/countries" component={CountriesPage} />
    {/*<Route path="/admin" component={AdminPage} />*/}
    <ProtectedRoute path="/admin" component={AdminPage} />
  </Router>
}

export default connect(state => ({
  signedIn: !!state[moduleName].user
}), {signOut})(App)