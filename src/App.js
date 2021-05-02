import React from "react"
import { Router, Route, Link } from "react-router-dom"
import HomePage from "./HomePage"
import { createBrowserHistory as createHistory } from "history"

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