// SurveyNew is container component that shows pages of wizard form: SurveyForm or SurveyFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

/**
 * This is the parent component for the survey multi page wizard form.  It's job is to toggle between the multiple pages of the form.
 */

class SurveyNew extends Component {

  // create-react-app makes this short hand state initialization possible:
  state = { showFormReview: false };

  renderContent() {
    if(this.state.showFormReview) {
      return <SurveyFormReview onCancel={() => this.setState({ showFormReview: false })} />
    }

    return <SurveyForm onSurveySubmit={() => this.setState({ showFormReview: true })} />
  }
  
  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}

/**
 * This hooks up the wizard form container to redux-form because redux-form has a default behavior that clears the store whenever a 
 * component is unmounted that is hooked up to it and the destroyOnUnmount is not set to false (it is true by default).  
 * 
 * This means that even though the child form component has destroyOnUnmount set to false to persist field values, it will be overwritten
 * when the parent container component is unmounted since it's destroyOnUnmount is set to true by default and the store will be cleared.
 */
export default reduxForm({
  form: 'surveyForm'
})(SurveyNew);