# Blog App APIs

## Overview
This Blog API is built using Node.js, JavaScript, GraphQL, WebSocket, Redis, and MongoDB. The application allows users to create, delete, and edit users, the user can verify this email is correct by OTP sent to his email, comments, and posts. Users can like or dislike posts or comments, follow or block other users, and receive notifications via subscriptions when followed users post new content or when someone comments on their posts.

## Features
- **User Management**: Create, delete, and edit user profiles.
- **Post Management**: Create, delete, and edit posts.
- **Comment Management**: Create, delete, and edit comments on posts.
- **Like/Dislike**: Users can like or dislike posts and comments.
- **Follow/Block Users**: Users can follow or block other users.
- **Notifications**: Users receive real-time notifications for new posts from followed users and comments on their posts.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **JavaScript**: Programming language.
- **GraphQL**: API query language.
- **WebSocket**: Real-time communication.
- **Redis**: In-memory data structure store user for caching to for quick response.
- **Helmet**: Security middleware for HTTP headers.
- **HPP**: HTTP parameter pollution prevention.
- **RateLimit**: Rate limiting middleware.
- **Nodemailer**: For sending emails to the user.

### Prerequisites
- Node.js
- MongoDB
- Redis


