# BiteHub

BiteHub is a full-stack food ordering web application that allows users to browse meals, manage their cart, place orders, make secure online payments, track orders, and leave reviews and ratings.

The project was designed and developed as a practical full-stack web development project, with both user-facing features and an administrative dashboard.

**Built by Verixzon.**

Verixzon is a technology brand focused on building modern digital experiences and web applications and looking forward to join the software engineering world.

## 🚀 Features

### User Features

- Browse available meals
- View meal details
- Add meals to cart
- Increase or decrease item quantities
- Remove items from cart
- User registration and login
- Secure authentication
- User account management
- Place food orders
- View order history
- Track order status
- Secure online payment with Paystack
- Leave reviews and ratings
- Edit personal reviews
- Delete personal reviews
- Responsive design for different screen sizes

### Admin Features

- Admin authentication and protected dashboard
- View registered users
- Manage user accounts
- Manage meals and menu items
- Manage orders
- Update order status
- View and manage reviews
- Delete inappropriate reviews
- Manage user roles
- Monitor important application activities

---

## 🛠️ Technologies Used

### Frontend

- React
- JavaScript
- React Router
- HTML5
- CSS3
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv

### Payment

- Paystack

### Tools & Deployment

- Visual Studio Code
- Git
- GitHub
- Vercel
- Render

---

## 📁 Project Structure

```text
BiteHub/
│
├── backend/
│   ├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── db.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── .env
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── dist/
├── node_modules/
│
├── .vscode/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

## Deployment

BiteHub has been configured for production deployment with separate frontend and backend environments.
The production setup includes:
Production frontend
Production backend API
MongoDB database
Paystack payment integration
Environment-based configuration
Protected production credentials

## Responsive Design
BiteHub is designed to work across different screen sizes, including:
Desktop
Laptop
Tablet
Mobile devices

## Future Improvements
Possible future improvements include:
Food search and filtering
Category filtering
Wishlist functionality
More advanced order tracking
Email notifications
Improved admin analytics
Delivery address management
Additional payment options
Progressive Web App (PWA) support
