import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchAllSurveys();
  }

  renderSurveys() {
    return this.props.surveys.map(survey => {
      return (
        // remember to use _id instead of just id when referencing the uuid in mongo
        <div class="card blue-grey darken-1" key={survey._id}>
          <div class="card-content white-text">
            <span class="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            {/* Date returned is a string timestamp from the Date object stored in mongo - format it to be more readable */}
            <p className="right">Sent: {/* new Date(survey.dateSent).toLocaleDateString() */}</p>
          </div>
          <div class="card-action">
            <a href="#">Yes: {survey.yes}</a>
            <a href="#">No: {survey.no}</a>
          </div>
        </div>
      );
    })
  }

  render() {
    return (
      <div>
        {this.renderSurveys()}
      </div>
    );
  }
}

const mapStateToProps = ({ surveys }) => ({
  surveys
});

export default connect(mapStateToProps, { fetchAllSurveys })(SurveyList);