var express = require('express');
var router = express.Router();

/* GET home (landing) page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CourtOps' });
});


// Members
router.get('/members', (req, res) => res.render('members/list', { title: 'Members' }));
router.get('/members/add', (req, res) => res.render('members/add', { title: 'Add Member' }));
router.get('/members/:id', (req, res) => res.render('members/detail', { title: 'Member Detail' }));

// Coaches
router.get('/coaches', (req, res) => res.render('coaches/list', { title: 'Coaches' }));
router.get('/coaches/add', (req, res) => res.render('coaches/add', { title: 'Add Coach' }));
router.get('/coaches/:id', (req, res) => res.render('coaches/detail', { title: 'Coach Detail' }));

// Classes
router.get('/classes', (req, res) => res.render('classes/list', { title: 'Classes' }));
router.get('/classes/add', (req, res) => res.render('classes/add', { title: 'Add Class' }));
router.get('/classes/:id', (req, res) => res.render('classes/detail', { title: 'Class Detail' }));


module.exports = router;
