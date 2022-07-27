const express = require('express');
const router = express.Router();
const db = require('../database/db');


/* GET home page. */
router.get('/',  function (req, res, next) {
    db.serialize(() => {
        db.all("SELECT * FROM project", (err, rows) => {
            if (err) {
                throw err;
            }else{
                res.render('index', { title: 'Express', datas: rows });
            }

        });
    });


});

module.exports = router;
