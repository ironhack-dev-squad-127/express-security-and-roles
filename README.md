# Express Security And Roles | IronStore

## Goal

The goal of this project is to create a t-shirt market place where:
- people can add t-shirts
- admin can validate t-shirts
- people can see all validated t-shirts to buy

If you want some inspiration, you can go on [Qwertee](https://www.qwertee.com).

## Steps to reproduce to start

```sh
irongenerate --auth express-security-and-roles
cd express-security-and-roles
code .
```

Create `models/Tshirt.js` 
```javascript
// models/Tshirt.js
const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const tshirtSchema = new Schema({
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

const Tshirt = mongoose.model('Tshirt', tshirtSchema)
module.exports = Tshirt
```

Change the navbar of `views/layout.hbs` 
```html
<!-- views/layout.hbs -->

<!-- ... -->

{{!-- TODO: Display "Login/Signup/My T-Shirts" only if not connected --}}
{{!-- TODO: Display "Logout" only if connected --}}
<nav>
  <a href="/">Home</a>
  <a href="/auth/login">Login</a>
  <a href="/auth/signup">Signup</a>
  <a href="/auth/logout">Logout</a>
  <a href="/tshirts">All tshirts</a>
  <a href="/add-tshirt">Add t-shirt</a>
  <a href="/my-tshirts">My t-shirts</a>
</nav>
```

Create `views/tshirts.hbs`
```html
<h1>All t-shirts</h1>


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Picture</th>
    </tr>
  </thead>
  <tbody>
    {{#each tshirts}}
    <tr>
      <th>{{this.name}}</th>
      <th>{{this.price}}€</th>
      <th><img src="{{this.pictureUrl}}"></th>
    </tr>
    {{/each}}
  </tbody>
</table>
```

Create `views/add-tshirt.hbs`
```hbs
<h1>Add tshirt</h1>

<form action="/add-tshirt" method="post">
  Name: <input type="text" name="name"><br>
  Picture: <input type="text" name="pictureUrl"><br>
  Price: <input type="number" name="price"><br>
  <button type="submit">Create the tshirt</button>
</form>
```

Update `routes/index.js`
```javascript
const express = require('express')
const router  = express.Router()
const Tshirt = require('../models/Tshirt')

// Home page
router.get('/', (req, res, next) => {
  res.render('index')
})


// Page to display all tshirts
router.get('/tshirts', (req,res,next)=>{
  Tshirt.find({ isValidated: true })
  .then(tshirts => {
    res.render('tshirts', { tshirts })
  })
})



// TODO: make the following routes available only if connected 


// Page to display the form to add a tshirt
router.get('/add-tshirt', (req,res,next)=>{
  res.render('add-tshirt')
})


// Page to handle the form submission and add a tshirt
router.post('/add-tshirt', (req,res,next)=>{
  Tshirt.create({
    name: req.body.name,
    pictureUrl: req.body.pictureUrl,
    price: req.body.price,
  })
  .then(() => {
    res.redirect('/tshirts')
  })
  .catch(next)
})

// Page to see the tshirts of the connected person
router.get('/my-tshirts', (req,res,next)=>{
  Tshirt.find() // TODO: change the filter to only show the right tshirts
  .then(tshirts => {
    res.render('tshirts', {tshirts})
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

Change the route `POST /add-tshirt` to save the `_owner`. You will have to use `req.user`.

### Step 4

Change the route `GET /my-tshirts` to only show the tshirts of the connected user. You will have to use `req.user`.
