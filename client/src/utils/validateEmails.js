// This helper function returns a list of emails that are invalid for use in validating the emails field.

// use emailregex.com to get regexes to validate emails.
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (emails) => {
  // remove trailing comma if user leaves it on at the end of email list in field
  emails = emails.replace(/,\s*$/, '');
  
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => re.test(email) === false);

    if (invalidEmails.length) {
      return `These emails are invalid: ${invalidEmails}`;
    }
    
    return null;
}
