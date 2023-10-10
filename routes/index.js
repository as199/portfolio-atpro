const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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

    console.log("req.body : ",req.body);
  // find user by email and if exits, compare password encrypted with bcrypt
    db.serialize(() => {
        db.all("SELECT * FROM utilisateur WHERE email = ?", [email], (err, rows) => {
            if (err) {
                console.log("err : ",err)
            throw err;
            } else {
                console.log("rows : ",rows)
            if (rows.length > 0) {
                if (bcrypt.compareSync(password, rows[0].password)) {
                req.session.user = rows[0];
                res.redirect('/administration');
                } else {
                res.render('login', { title: 'Atpro', message: 'Email or password incorrect' });
                }
            } else {
                res.render('login', { title: 'Atpro', message: 'Email or password incorrect' });
            }
            }
        });
    });
});

/**
 * Post Register
 */
router.post('/register', function(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    // find user by email and if exits, compare password encrypted with bcrypt
        db.serialize(() => {
            db.all("SELECT * FROM utilisateur WHERE email = ?", [email], (err, rows) => {
                if (err) {
                throw err;
                } else {
                if (rows.length > 0) {
                    res.render('login', { title: 'Atpro', message: 'Email already exists' });
                } else {
                    db.run("INSERT INTO user (name, email, password) VALUES (?, ?, ?, ?)", [name, email, password], (err) => {
                        if (err) {
                            throw err;
                        } else {
                            res.redirect('/login');
                        }
                    });
                }
                }
            });
        });
});


/**
 * Get Administration
 */
router.get('/administration', function(req, res, next) {
    if (req.session.user) {
        res.render('administration', { title: 'Atpro', user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

/**
 * Logout
 */
router.get('/admin-logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

/**
 * Get List Project
 */
router.get('/admin-projets', function(req, res, next) {
    if (req.session.user) {
        db.serialize(() => {
            db.all("SELECT * FROM project", (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    res.render('project', { title: 'Atpro', projects: rows, user: req.session.user });
                }
            });
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
