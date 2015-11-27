# ABX Developer Test

A simple TODO app built with Node.js, MongoDB and Angular.

Node provides the RESTful API. Angular provides the frontend and accesses the API. MongoDB stores the data.
Typical time taken is 2 to 3 hours.  Please complete in one sitting, committing changes often. 

## Requirements

- [Node and npm](http://nodejs.org)
- [MongoDB](https://docs.mongodb.org/manual/installation/)

## Installation

1. Clone the repository: `git clone git@github.com:bullioncapital/abx-developer-test.git`
2. Install the application: `npm install`
3. Start the server in normal mode: `npm start`
4. Alternatively, start the server in debug mode: `npm run debug`
5. View in browser at `http://localhost:8080/`

## User Stories (Feature Enhancements)

1. As a Developer, I want to convert callbacks to promises in 'app/routes.js' so that other developers can work faster.
2. As a Developer, I want to add appropriate unit tests on the server side so that I can be sure the app API routes work.
3. As an End User, I want a validation message to appear when I click 'Add' but haven't entered a Todo. The message will state "Please enter a Todo".
4. As an End User, I want a validation message to appear when I add a Todo that is already in the list. The message will state "'x' is already in the Todo list".
5. As an End User, I want to be able to sort my Todos A-Z and Z-A so that I can find Todos in a long list easier.
6. As an End User, I want to store the date and time of when a Todo was added and have it display on the screen so that I can see when a Todo was entered.

## Bug Reports

1. Empty Todos are not allowed. It is currently possible to enter a blank Todo by clicking 'Add' after entering and then clearing text in the input field.
