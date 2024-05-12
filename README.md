# Taxi Buddy

This repository contains the frontend and the backend code for the taxi buddy website. Taxi Buddy is the one stop solution that allows students to pool taxis from uni to the airport and vice versa.

## Environment variables

Before running the backend, setup the following environment variables:

- `SESSION_SECRET`: Your secret for the express session

These variables must be set in a .env file in the root directory of your project. It's recommended to not commit these to version control.

## Getting Started

To get started with the backend, follow these steps:

1. Clone this git repo on your local machine

2. Install the necessary dependancies by running:

    ```bash
    npm install
    ```

3. Start by running:

    ```bash
    nodemon server.js
    ```

## API reference

### Frontend endpoints

- `GET /signup`: Fetches the signup page content.
- `GET /login`: Fetches the login page content.
- `GET /mySchedule`: Fetches the mySchedule page content.
- `GET /taxiPooling`:Fetches the taxi pooling page content.
- `GET /aboutUs`:Fetches the about us page content.
- `GET /account`:Fetches the account page content.

### User endpoints

- `POST /signup`: Registers a new user.
- `POST /login`: Authenticates user and maintains user session.
- `DELETE /account`: Logs out the user.

### Taxi endpoints

- `GET /taxi-data/day-wise/:day/:month/:year`: Count of taxis pooled on given date.
- `GET /taxi-data/hour-wise/:day/:month/:year/:hour`: Count of taxis pooled on given date and time.
- `GET /taxi-data/booked/:day/:month/:year/:hour`: Data of taxis pooled on given date and time.
- `GET /taxi-data/my-taxis`: Taxis pooled by a user.
- `POST /schedule-new-taxi`: Schedule a new taxi pool.
- `PATCH /join-taxi-pool`: Join an existing taxi pool.
- `PATCH /cancel-booking`: Leave an existing taxi pool.

## NOTE

While reviewing the project, you may come across some minor bugs that require fixing. I acknowledge these issues but have chosen to overlook them for now, as I have successfully achieved my goal of completing my first full-stack project from end to end.
