# account-service

## Overview

Account Service is a Node.js application that provides user account management functionalities, including user registration, authentication, and authorization. This service uses Express.js for the server, Mongoose for database interaction, and MSAL for handling Microsoft authentication.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [User Flows](#user-flows)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/congmul/account-service.git
   cd account-service
    ```
2. Install dependencies:
    ```sh
    pnpm install
    ```
3. Set up environment variables:

    Create a .env file in the root directory and add the values (Please check env.example file)

4. Start the application:
    ```sh
    pnpm run dev
    ```
## Endpoints
Local: [API-specification](http://locahost:3000/api-spec)

## User Flows
1. User Initiates Login
 * The user navigates to the endpoint.
    ```sh
    /auth/auth-code-url/${ServiceProvider}
    ```
 * The server constructs the authorization URL and redirects the user to the Microsoft login page / Google login page.

2. User Logs In:
 * The user logs in using their Microsoft/Google account.
 * After successful authentication, Microsoft/Google redirects the user back to the application’s /redirect endpoint with an authorization code.

3. Server Exchanges Auth Code for Tokens:
 * The server receives the authorization code and exchange it for an access token, ID token, and refresh token.
 * The server can then decode the ID token to get user information and store the tokens securely.

## Project Structure
```bash
account-service/
  ├── src/ 
  │ ├── auth/
  │ │    ├── GoogleAuthProvider.ts
  │ │    └── MSAuthProvider.ts
  │ ├── config/
  │ │    ├── db.ts
  │ │    └── config.ts
  │ ├── models/
  │ │    └── userModel.ts
  │ ├── routes/
  │ │    ├── auth.ts
  │ │    ├── index.ts
  │ │    └── swagger.ts
  │ ├── services/
  │ │    ├── index.ts
  │ │    └── userService.ts
  │ ├── types/
  │ │    ├── index.ts
  │ │    └── userTypes.ts
  │ ├── api-spec.json 
  │ └── app.ts
  ├── Dockerfile
  ├── package.json
  └── .env
```
