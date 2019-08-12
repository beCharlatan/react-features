import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from "react-redux"
import store from "./redux"
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import App from './components/App'
import './config'

const Root = () => {
  return <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </Provider>
}

if (module.hot) {
  module.hot.accept()
}

const rootElement = document.getElementById("root")
ReactDOM.render(<Root />, rootElement)