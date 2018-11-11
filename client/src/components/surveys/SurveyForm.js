// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
// this is a helper which allows the form to communicate with the redux store:
// the Field helper is used to render any type of traditional HTML form element.
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';

// create array of Fields to map over to condense code
const FIELDS = [
  { label: "Survey Title", name: "title" },
  { label: "Subject Line", name: "subject" },
  { label: "Email Body", name: "body" },
  { label: "Recipient List", name: "emails" }
];

class SurveyForm extends Component {
  

  renderFields() {
    return _.map(FIELDS, ({ label, name }) => {
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
  errors.emails = validateEmails(values.emails || '');  
  // make sure to provide a default '' since validate fn runs on every render of the form component to avoid the error of 
  // error.emails being undefined and put this above the check for empty fields so it is overwritten with that message if field is empty

  _.each(FIELDS, ({ name }) => {
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
  form: 'SurveyForm'
})(SurveyForm);