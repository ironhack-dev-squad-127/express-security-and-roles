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
