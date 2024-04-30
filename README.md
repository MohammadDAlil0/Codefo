# Codefo Project

This project provides services for Competitive Programmers allowing them to manage theirs favorite problems, storing them in nice folders, publish them to the others, and much more. Also, the project contains varios tools which be heplful for them such as Graph editor, tools for testing, competitve contests, and even more. 

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints In Postman](#api-endpoints-in-postman)
- [Notes](#notes)
## Requirements

To run this project, you will need:

- Node.js
- MongoDB

## Getting Started

### Prerequisites

Again, Make sure you have Node.js and MongoDB installed on your machine.

### Installation
1. Clone the repository:

```bash
git clone https://github.com/MohammadDAlil0/Codefo
```
2. Install dependencies:
```bash
cd codefo
npm install
```
3. Set up environment variables:

Create a config.env file in the root directory of the project and provide the following variables: 
```bash
DATABASE_LOCAL="mongodb://127.0.0.1:27017/Codefo"
PORT=4000

NODE_ENV=development

JWT_SECRET=your-jwt-secret
JWT_EXPIRE_IN=your-jwt-expire

EMAIL_HOST=smtp.gmail.com
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-password 
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=yout-team-name
```
4. Start the server:
```bash
npm start
```
The server should now be running on http://localhost:3000.

### API Endpoints In Postman
You can use and see the APIs using Postman using this link: https://documenter.getpostman.com/view/27420685/2sA2rAyMWg

### Notes

- Changing The Environment: You can set NODE_ENV in your config.env file to be equal to developer or to be equal to production. developer environment will connect to a local database, while the production environmet will connect to an online database(your cluster in mongodb).
