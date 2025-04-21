# Paytm Wallet (Full-Stack)

This is a full-stack web application mimicking the Paytm wallet using **React** (Frontend) and **Node.js** (Backend). The application allows users to log in, sign up, send money, and view their account details.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)


## Overview

The Paytm Wallet app allows users to perform the following actions:

1. **Sign Up** – Register new users with email and password.
2. **Login** – Log in with existing credentials.
3. **Dashboard** – View a user-specific dashboard with a list of users to send money to.
4. **Send Money** – Transfer money to another user by entering the amount.
5. **Logout** – Sign out from the application.

This project has a React frontend, connected to a Node.js backend with MongoDB to store user information and transactions.

## Tech Stack

- **Frontend**: React.js, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token) for user sessions
- **State Management**: React `useState` and `useEffect`
- **API Communication**: Fetch API for making requests between the frontend and backend

## Features

- **User Authentication**: Allows users to sign up, log in, and access a secure dashboard.
- **Send Money**: Users can send money to other users from the dashboard by specifying the amount.
- **Error Handling**: Proper error messages for unsuccessful operations.

## Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anshumaan-Tripathi/full-stack-paytm-wallet.git
   cd full-stack-paytm-wallet/frontend
