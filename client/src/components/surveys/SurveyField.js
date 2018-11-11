import React from 'react';

// this custom field component has access to the props from redux-form in the Field parent component it's passed to on SurveyForm.js.
// ** Because this input is a child of Field from redux-form, it has access to props passed in which include a input prop that has 
// a bunch of event listeners that redux-form watches and handles if needed (sending stuff to the store, etc.)
export default ({ input, label, meta: { error, touched } }) => {

  return (
    <div>
      <label>{label}</label>
      {/* Spread out the event handler props from the input object on props.input (onChange, onBlur, etc.) */}
      <input {...input} style={{ marginBottom: '5px' }} /> 
      {/* meta.error will contain any error message set in the validation function in SurveyForm for the field. 
          The validate function is run when the form renders when using redux-form, so empty field errors will show.
          You use the meta.touched prop to check if the user has interacted with the form field first before displaying any
          error message.
      */} 
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error} 
      </div>
    </div>
  );
};

