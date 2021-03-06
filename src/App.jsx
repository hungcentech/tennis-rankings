// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { initStore } from "./state";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { createMuiTheme, ThemeProvider, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { purple, yellow } from "@material-ui/core/colors";

import AppBar from "./components/AppBar.jsx";
import Home from "./components/Home.jsx";
import ClubList from "./components/Clubs/ClubList.jsx";
import PlayerList from "./components/Players/PlayerList.jsx";

// -----------------------------------------------------------------------------

const store = initStore();

// -----------------------------------------------------------------------------

let muiTheme = createMuiTheme({
  palette: {
    primary: {
      // main: blue.A200
      main: yellow.A200
    },
    secondary: {
      // main: pink.A200
      main: purple.A200
    },
    error: {
      main: "#cf6679"
    },
    type: "dark"
  }
});

const styles = theme => {
  return {
    root: {
      flex: 1
    },
    childenWrapper: {
      paddingBottom: theme.mixins.toolbar.minHeight
    }
  };
};

// -----------------------------------------------------------------------------

const RoutedApp = withStyles(styles)(({ classes, router, children }) => {
  return (
    <div className={classes.root}>
      <div className={classes.childenWrapper}>{children}</div>
      <AppBar router={router} />
    </div>
  );
});

// -------------------------------------

RoutedApp.propTypes = {
  router: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router history={browserHistory}>
          <Redirect from="/tennisrankings" to="/tennisrankings/home" />
          <Route path="/tennisrankings" component={withRouter(RoutedApp)}>
            <Route path="home" component={withRouter(Home)} />
            <Route path="clubs" component={withRouter(ClubList)} />
            <Route path="players" component={withRouter(PlayerList)} />
            {/* <Route path="players/:id" component={withRouter(PlayerEdit)} /> */}
            {/* <Route path="matches" component={MatchList} /> */}
            {/* <Route path="matches/:id" component={withRouter(MatchEdit)} /> */}
            <Route path="*" component={withRouter(Home)} />
            {/* <Redirect from="*" to="/tennisrankings/home" /> */}
          </Route>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

// -------------------------------------

App.propTypes = {};

// -----------------------------------------------------------------------------

ReactDOM.render(<App />, document.getElementById("contents"));

// -------------------------------------

if (module.hot) {
  module.hot.accept();
}

// -----------------------------------------------------------------------------
