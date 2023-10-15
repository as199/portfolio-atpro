const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/db');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: './public/images', // Define your image storage folder
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save the original file name
  },
});
const upload = multer({ storage });


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

  console.log("req.body : ", req.body);
  // find user by email and if exits, compare password encrypted with bcrypt
  db.serialize(() => {
    db.all("SELECT * FROM utilisateur WHERE email = ?", [email], (err, rows) => {
      if (err) {
        console.log("err : ", err)
        throw err;
      } else {
        console.log("rows : ", rows)
        if (rows.length > 0) {
          if (bcrypt.compareSync(password, rows[0].password)) {
            req.session.user = rows[0];
            console.log(req.session.user);
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

/**
 * Get add Project page
 */
router.get('/admin-projects-create', function(req, res, next) {
  if (req.session.user) {
    const projet = {
      title: '',
      techno: '',
      link: '',
      description: '',
      image: ''
    };
    res.render('projet/create', { title: 'Atpro', user: req.session.user, projet: projet });
  } else {
    res.redirect('/login');
  }
});

/**
 * Get edit Project page
 */
router.get('/admin-projects-edit/:id', function(req, res, next) {
  if (req.session.user) {
    const id = req.params.id;
    db.serialize(() => {
      db.all("SELECT * FROM project WHERE id = ?", [id], (err, rows) => {
        if (err) {
          throw err;
        } else {
          res.render('projet/edit', { title: 'Atpro', user: req.session.user, projet: rows[0] });
        }
      });
    });
  } else {
    res.redirect('/login');
  }
});

/**
 * Add Project
 */
router.post('/admin-projects-create', upload.single('image'), (req, res) => {
  const { title, techno, link, description } = req.body;
  const imagePath = req.file ? '/images/' + req.file.filename : null;
  console.log(req.body, imagePath)
  // Insert form data into the SQLite database
  db.run(
    'INSERT INTO project (title, techno, link, description, image) VALUES (?, ?, ?, ?, ?)',
    [title, techno, link, description, imagePath],
    (err) => {
      if (err) {
        res.redirect('/admin-projets?success=0');
      } else {
        res.redirect('/admin-projets?success=1'); // Redirect to a success page or the home page
      }
    }
  );
});


/**
 * Edit Project
 */
router.post('/admin-projects-edit/:id', upload.single('image'), (req, res) => {
  const { title, techno, link, description } = req.body;
  const id = req.params.id;
  const imagePath = req.file ? '/images/' + req.file.filename : null;

  // Insert form data into the SQLite database
  db.run(
    'UPDATE project SET title = ?, techno = ?, link = ?, description = ?, image = ? WHERE id = ?',
    [title, techno, link, description, imagePath, id],
    (err) => {
      if (err) {
        res.redirect('/admin-projets?success=3');
      } else {
        res.redirect('/admin-projets?success=2');
      }
    }
  );
});

/**
 * Delete Project
 */
router.get('/admin-projects-delete/:id', function(req, res, next) {
  const id = req.params.id;
  db.serialize(() => {
    db.run("DELETE FROM project WHERE id = ?", [id], (err) => {
      if (err) {
        return res.json({ success: false });
      } else {
        return res.json({ success: true });
      }
    });
  });
});



module.exports = router;
