const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  const classes = req.db.classes.getAllClasses();
  res.render('classes/list', { classes });
});


router.get('/add', (req, res) => {
  res.render('classes/add');
});


router.post('/add', (req, res) => {
  const { class_name, coach, class_date, class_time, capacity } = req.body;
  req.db.classes.createClass({ class_name, coach, class_date, class_time, capacity });
  res.redirect('/class');
});


router.get('/:id', (req, res) => {
  const classes = req.db.classes.getClassById(req.params.id);
  res.render('classes/detail', { classes });
});


router.post('/:id/status', (req, res) => {
  req.db.class.updateClass(req.params.id, req.body.status);
  res.redirect(`/classes/${req.params.id}`);
});


router.post('/:id/delete', (req, res) => {
  req.db.classes.deleteClass(req.params.id);
  res.redirect('/classes');
});

module.exports = router;