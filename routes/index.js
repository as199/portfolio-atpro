const express = require('express');
const router = express.Router();
const db = require('../database/db');


/* GET home page */
router.get('/', function(req, res, next) {
  db.serialize(() => {
    db.all("SELECT * FROM project", (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.render('index', { title: 'Atpro', datas: rows });
      }
    });
  });
});

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Atpro' });
});

/* POST login */
router.post('/login', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  db.serialize(() => {
    db.get("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], (err, row) => {
      if (err) {
        throw err;
      } else if (row) {
        res.redirect('/users');
      } else {
        res.render('login', {
          title: 'Atpro',
          message: 'Invalid username or password'
        });
        return;
      }
    });

  });

});



module.exports = router;
