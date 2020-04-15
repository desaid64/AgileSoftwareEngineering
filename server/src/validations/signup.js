import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
    let errors = {};
    if(data.firstName === ""){
        errors.firstName = 'This field is required';
    }
    if(data.lastName === ""){
        errors.lastName = 'This field is required';
    }
    if(data.username === ""){
        errors.username = 'This field is required';
    }
    if(data.email==="") {
        errors.email = 'This field is required';
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }
    if(data.password==="") {
        errors.password = 'This field is required';
    }
    if(data.passwordConfirmation==="") {
        errors.passwordConfirmation = 'This field is required';
    }
    if(data.phoneNumber==="") {
        errors.phoneNumber = 'This field is required';
    } else {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        console.log(regex.test(data.phoneNumber))
        if(!regex.test(data.phoneNumber) ) {
            errors.phoneNumber = 'Invalid Phone Number';
        }
    }
    if(!Validator.equals(data.password,data.passwordConfirmation)) {
        errors.passwordConfirmation = 'Passwords must match';
    }
    if(data.language==="") {
        errors.language = 'This field is required';
    }
    if(data.timezone==="") {
        errors.timezone = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
