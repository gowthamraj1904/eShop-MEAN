# eShop

MEAN Stack E-Shop App using Angular 15, NodeJS, MongoDB

**Developed by** **_GOWTHAMRAJ S_**

---

## Required Tools

1. VS Code
2. NodeJS
3. MongoDB Atlas
4. Postman/[Talend API Tester - Free Edition](https://chrome.google.com/webstore/detail/aejoelaoggembcahagimdiliamlcdmfm)

---

## Install required libraries

### Initialize npm

_npm init_

---

### Install Prettier

_npm install prettier_

**Config**

`{
"trailingComma": "none",
"tabWidth": 4,
"semi": false,
"singleQuote": true
}`

---

### Install Node Monitor

_npm install nodemon_

---

Update npm start script in package.json file

---

### Install ExpressJS

_npm install express_

---

Create app.js and use express js

---

### Install dotEnv

_npm install dotenv_

---

Create Environment variable -> .env file

---

Previously in node application we were using a library called body-parser to parse json data which comes from the frontend to the backend, But now this library got deprecated and express has ability to parse the data to json without using external library as you saw in the previous video. so from now on, if you see in next lectures we are using body-parser, just replace _app.use(bodyParser.json()) with app.use(express.json())_

---

### Install Morgan

_npm install morgan_

To Log HTTP request

---

### Install CORS

_npm install cors_

---

### Install Mangoose

_npm install mongoose_

---

### MongoDB

Create Cluster - add username and password(password should not contains special characters).
Create a database in mongoDB and add collection/table.
Network Access - Add current IP address

---

MongoDB Schema to create a collection/table

---

### BCryptJS
To password hash
_npm install mongoose_

---

### JSON Web Token
_npm install jsonwebtoken_

---

### Express JWT
_npm install express-jwt_

---

### Multer
To upload files to the server
_npm install multer_
