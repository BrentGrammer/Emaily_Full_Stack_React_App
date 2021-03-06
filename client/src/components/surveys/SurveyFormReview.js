import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
// withRouter helper wrapper allows access to react-router methods like history for navigating programatically
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {

  // here take the array of fields from the imported constant to map over and make divs with the label and set the value from the 
  // form associated with the name of the field.  
  const reviewFields = _.map(formFields, ({ label, name }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>
          {formValues[name]}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button 
      // onclick dispatches the action generator passed into connect on props
      // history passed in to navigate programatically with react-router after async operation in the action
        onClick={() => submitSurvey(formValues, history)}
        className="green white-text btn-flat right">
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    // for persisting form values on back or page change - (destroyOnUnmount is set to false in the form config obj as well)
    formValues: state.form.surveyForm.values
  };
};

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));