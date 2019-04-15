# Express Security And Roles | IronStore

## Goal

The goal of this project is to create a website where:
- people can add tee-shirts
- admin can validate tee-shirts
- people can see all validated tee-shirts to buy

## Steps to reproduce to start

```sh
irongenerate --auth express-security-and-roles
cd express-security-and-roles
code .
```

Create `models/TeeShirt.js` 
```javascript
// models/TeeShirt.js
const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const roomSchema = new Schema({
  name: String,
  pictureUrl: String,
  price: { 
    type: Number,
    min: 0
  },
  isValidated: { 
    type: Boolean,
    default: false,
  },
  _owner: { // `_` is a convention for ObjectId
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
})

const TeeShirt = mongoose.model('TeeShirt', roomSchema)
module.exports = TeeShirt
```

Change the navbar of `views/layout.hbs` 
```html
<!-- views/layout.hbs -->

<!-- ... -->

{{!-- TODO: Display "Login/Signup/My rooms" only if not connected --}}
{{!-- TODO: Display "Logout" only if connected --}}
<nav>
  <a href="/">Home</a>
  <a href="/auth/login">Login</a>
  <a href="/auth/signup">Signup</a>
  <a href="/auth/logout">Logout</a>
  <a href="/rooms">All rooms</a>
  <a href="/add-room">Add room</a>
  <a href="/my-rooms">My rooms</a>
</nav>
```

Create `views/rooms.hbs`
```hbs
<h1>All rooms</h1>

<ul>
{{#each rooms}}
  <li>{{this.name}}</li>
{{/each}}
</ul>
```

Create `views/add-room.hbs`
```hbs
<h1>Add room</h1>

<form action="/add-room" method="post">
  Name: <input type="text" name="name"><br>
  Description: <input type="text" name="description"><br>
  Is Published: 
  <select name="isPublished">
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
  <br>
  <button type="submit">Create the room</button>
</form>
```

Update `routes/index.js`
```javascript
const express = require('express')
const router  = express.Router()
const TeeShirt = require('../models/TeeShirt')

// Home page
router.get('/', (req, res, next) => {
  res.render('index')
})


// Page to display all tee-shirts
router.get('/tee-shirts', (req,res,next)=>{
  TeeShirt.find({ isPublished: true })
  .then(teeShirts => {
    res.render('tee-shirts', { teeShirts })
  })
})



// TODO: make the following routes available only if connected 


// Page to display the form to add a room
router.get('/add-room', (req,res,next)=>{
  res.render('add-room')
})


// Page to handle the form submission and add a room
router.post('/add-room', (req,res,next)=>{
  TeeShirt.create({
    name: req.body.name,
    description: req.body.description,
    isPublished: req.body.isPublished,
  })
  .then(() => {
    res.redirect('/tee-shirts')
  })
  .catch(next)
})

// Page to see the tee-shirts of the connected person
router.get('/my-tee-shirts', (req,res,next)=>{
  TeeShirt.find() // TODO: change the filter to only show the right rooms
  .then(teeShirts => {
    res.render('teeShirts', {teeShirts})
  })
  .catch(next)
})

module.exports = router

```


## Role

### Step 1
Create a field `role` in `models/User.js`. The possible values are: `"SIMPLE_USER"` and `"ADMIN"`.

### Step 2
Create middlewares `checkConnected` and `checkAdmin` (or `checkRole`) and protect the routes with this middleware.


### Step 3

Change the route `POST /add-room` to save the `_owner`. You will have to use `req.user`.

### Step 4

Change the route `GET /my-tee-shirts` to only show the tee-shirts of the connected user. You will have to use `req.user`.
