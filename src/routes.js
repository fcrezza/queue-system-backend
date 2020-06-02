const express = require('express')
const bcrypt = require('bcrypt');
const passport = require('passport')

const router = express.Router()


// router.get('/authrequired', (req, res) => {
//   if(req.isAuthenticated()) {
//     res.send('you hit the authentication endpoint\n')
//   } else {
//     res.redirect('/')
//   }
// })

module.exports = router
