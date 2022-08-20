import React from "react"
import { Router, Route } from "react-router-dom"
import { createBrowserHistory as createHistory } from "history"

import HomePage from "./pages/HomePage"
import {ThemeProvider} from "@material-ui/styles";
import {createTheme} from "@material-ui/core";
import {blue, red} from "@material-ui/core/colors";

const history = createHistory()

const theme = createTheme({
    palette : {
        primary : {
            main : blue[300],
        },
        secondary : {
            main : blue[300],
        },
    }
})

export default function App() {
  return (
    <div className="App">
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Route path="/" exact component={HomePage} />
          </Router>
        </ThemeProvider>
    </div>
  )
}