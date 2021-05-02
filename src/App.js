import React from "react"
import { Router, Route } from "react-router-dom"
import { createBrowserHistory as createHistory } from "history"

import HomePage from "./HomePage"

const history = createHistory()

export default function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Route path="/" exact component={HomePage} />
      </Router>
    </div>
  )
}