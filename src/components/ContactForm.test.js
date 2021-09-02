import React from 'react';
import {findByLabelText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    //arrange
    render(<ContactForm/>)
    //act
    const header = screen.queryByText(/contact form/i)
    //assert
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    //arrange
    render(<ContactForm/>)
    //act
    const fnInput = screen.getByPlaceholderText(/edd/i);
    userEvent.type(fnInput, "abcd");

    await waitFor(() => {
        const errorMsg = screen.queryByText(/error: firstName must have at least 5 characters./i)
        //assert
        expect(errorMsg).toBeInTheDocument();
    })
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    //arrange
    render(<ContactForm/>)
    //act
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    const fnError = await screen.findByText(/Error: firstName must have at least 5 characters./i)
    const lnError = await screen.findByText(/Error: lastName is a required field./i)
    const emailError = await screen.findByText(/Error: email must be a valid email address./i)
    //assert
    expect(fnError).toBeInTheDocument();
    expect(lnError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)

    const fnInput = screen.queryByPlaceholderText(/edd/i);
    userEvent.type(fnInput, "acbcd");
    const lnInput = screen.queryByPlaceholderText(/burke/i);
    userEvent.type(lnInput, "efghd");
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    const emailError = await screen.getByText(/error: email must be a valid email address./i);

    expect(emailError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "vannguyen141290gmail.com");
    const emailError = await screen.getByText(/Error: email must be a valid email address./i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    //arrange
    render(<ContactForm/>);
    //act
    const fnInput = screen.queryByLabelText(/first Name*/i);
    userEvent.type(fnInput, "vanthi");
    const emailInput = screen.queryByLabelText(/email*/i);
    userEvent.type(emailInput, "vannguyen@gmail.com");
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    const lnError = await screen.findByText(/Error: lastName is a required field./i);
    //assert
    expect(lnError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    //arrange
    render(<ContactForm/>);
    //act
    const fnInput = screen.queryByLabelText(/first Name*/i);
    userEvent.type(fnInput, "vanthi");
    const lnInput = screen.queryByPlaceholderText(/burke/i);
    userEvent.type(lnInput, "efghd");
    const emailInput = screen.queryByLabelText(/email*/i);
    userEvent.type(emailInput, "vannguyen@gmail.com");
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    //feedback
    const fnFeedback = await screen.findByTestId(/firstnameDisplay/i);
    const lnFeedback = await screen.findByTestId(/lastnameDisplay/i);
    const emailFeedback = await screen.findByTestId(/emailDisplay/i);

    await waitFor(() => {
        const messageFeedback = screen.queryByTestId(/messageDisplay/i);
        //assert
        expect(messageFeedback).toBeNull();
    })
    // //assert
    expect(fnFeedback).toHaveTextContent(/First Name: vanthi/i);
    expect(lnFeedback).toHaveTextContent(/Last Name: efghd/i);
    expect(emailFeedback).toHaveTextContent(/Email: vannguyen@gmail.com/i);
});

test('renders all fields text when all fields are submitted.', async () => {
    //arrange
    render(<ContactForm/>);
    //act
    const fnInput = screen.queryByLabelText(/first Name*/i);
    userEvent.type(fnInput, "vanthi");
    const lnInput = screen.queryByPlaceholderText(/burke/i);
    userEvent.type(lnInput, "efghd");
    const emailInput = screen.queryByLabelText(/email*/i);
    userEvent.type(emailInput, "vannguyen@gmail.com");
    const messageInput = screen.queryByLabelText(/message/i);
    userEvent.type(messageInput, "this is a message for you");
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    //feeback
    const fnFeedback = await screen.findByTestId(/firstnameDisplay/i);
    const lnFeedback = await screen.findByTestId(/lastnameDisplay/i);
    const emailFeedback = await screen.findByTestId(/emailDisplay/i);
    const messageFeedback = await screen.findByTestId(/messageDisplay/i);
    //assert
    expect(fnFeedback).toHaveTextContent(/First Name: vanthi/i);
    expect(lnFeedback).toHaveTextContent(/Last Name: efghd/i);
    expect(emailFeedback).toHaveTextContent(/Email: vannguyen@gmail.com/i);
    expect(messageFeedback).toHaveTextContent(/message: this is a message for you/i);
})
