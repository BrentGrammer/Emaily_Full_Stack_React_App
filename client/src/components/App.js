import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    return (
      // MaterializeCSS class of container creates some margin on the left and right sides of the page so things aren't squished 
      // against the edges.
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route exact path="/surveys" component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
};

// the second arg is the imported actions to wire up with connect to allow them to be called on this.props.
// remember that the async redux actions imported already have access to dispatch internally so mapDispatchToProps is not needed here.
export default connect(null, actions)(App);