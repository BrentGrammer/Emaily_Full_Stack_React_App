// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
// this is a helper which allows the form to communicate with the redux store:
// the Field helper is used to render any type of traditional HTML form element.
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
// when importing constant into another file - don't neceessarily capitalize the name.
import formFields from './formFields';

class SurveyForm extends Component {
  

  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return <Field key={name} component={SurveyField} type="text" label={label} name={name} />
    })
  }

  render() {
    return (
      <div>
        {/* handleSubmit is a helper provided by redux-form on props which takes a function that fires when the user submits the form
            It can be used to send form data to the back end or process it some way. */}
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          {/* Note: this cancel link unmounts the SurveyNew container component which causes redux-form to dump all the values from the store 
              This is significant because if the user decides to leave the form to create a survey, the field values will not persist in the form
              when the user comes back to create a new survey and the store is cleared to present a blank form.  */}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button 
            className="teal btn-flat right white-text"
            type="submit"
          >
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    )
  }
}

// the validate function used in the options object is passed in a single arg object which contains all of the values coming from 
// the form.
// The object will have the name of each field and the value of the field { <nameOfField>: <fieldValue> , etc... }
/**** Must return an errors object - if the object is empty then redux-form assumes the entire form is valid. 
 *    The errors object should contain any of the names of the fields as keys from the form if there is a problem with one and a 
 *    error message as a value.
 * 
 *    If any key on the error object is undefined, then no error or validation message will be rendered. 
 * 
*/
function validate(values) {
  const errors = {};
  // returns a message with invalid emails if found, otherwise returns null/undefined:
  errors.recipients = validateEmails(values.recipients || '');  
  // make sure to provide a default '' since validate fn runs on every render of the form component to avoid the error of 
  // error.emails being undefined and put this above the check for empty fields so it is overwritten with that message if field is empty

  _.each(formFields, ({ name }) => {
     if (!values[name]) {
       errors[name] = 'You must provide a value';
     }
  })


  return errors;
}

// reduxForm essentially functions like connect()
// it takes one argument which is an object of config options of 'form' or 'validate' for ex.
export default reduxForm({
  validate, // this key can hold a function that will be called on each field when the form is submitted for validation
  form: 'surveyForm', // this namespaces this particular form in the redux store form prop - all related data will be under this prop name - useful if you have multiple forms
  destroyOnUnount: false // true by default - setting to false will preserve form field values if user goes back to the form
})(SurveyForm);