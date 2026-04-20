
const express = require('express');
const router = express.Router();
 

router.get('/', (req, res) => {
  try {
    const classes = req.db.classes.getAllClasses();
    res.render('classes/list', { classes });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load classes.' });
  }
});
 

router.get('/add', (req, res) => {
  try {
    const coaches = req.db.coaches.getAllCoaches();
    res.render('classes/add', { errors: [], formData: {}, coaches });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load form.' });
  }
});
 

router.post('/add', (req, res) => {
  const { class_name, coach, class_date, class_time, capacity } = req.body;
 
  const errors = [];
  if (!class_name?.trim())  errors.push('Class name is required.');
  if (!coach?.trim())       errors.push('Coach is required.');
  if (!class_date?.trim())  errors.push('Date is required.');
  if (!class_time?.trim())  errors.push('Time is required.');
  if (!capacity || isNaN(capacity) || parseInt(capacity) <= 0)
    errors.push('A valid capacity is required.');
 
  if (errors.length > 0) {
    try {
      const coaches = req.db.coaches.getAllCoaches();
      return res.render('classes/add', { errors, formData: req.body, coaches });
    } catch (err) {
      return res.status(500).render('error', { message: 'Failed to load form.' });
    }
  }
 
  try {
    req.db.classes.createClass({
      class_name: class_name.trim(),
      coach: coach.trim(),
      class_date: class_date.trim(),
      class_time: class_time.trim(),
      capacity: parseInt(capacity)
    });
    res.redirect('/classes');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to add class.' });
  }
});
 

router.get('/:id', (req, res) => {
  try {
    const cls = req.db.classes.getClassById(req.params.id);
    if (!cls) return res.status(404).render('error', { message: 'Class not found.' });
    const coaches = req.db.coaches.getAllCoaches();
    const editMode = req.query.edit === 'true';
    res.render('classes/detail', { cls, coaches, editMode, errors: [] });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load class.' });
  }
});
 

router.post('/:id/edit', (req, res) => {
  const { class_name, coach, class_date, class_time, capacity } = req.body;
 
  const errors = [];
  if (!class_name?.trim())  errors.push('Class name is required.');
  if (!coach?.trim())       errors.push('Coach is required.');
  if (!class_date?.trim())  errors.push('Date is required.');
  if (!class_time?.trim())  errors.push('Time is required.');
  if (!capacity || isNaN(capacity) || parseInt(capacity) <= 0)
    errors.push('A valid capacity is required.');
 
  if (errors.length > 0) {
    try {
      const cls = req.db.classes.getClassById(req.params.id);
      const coaches = req.db.coaches.getAllCoaches();
      return res.render('classes/detail', { cls, coaches, editMode: true, errors });
    } catch (err) {
      return res.status(500).render('error', { message: 'Failed to load class.' });
    }
  }
 
  try {
    req.db.classes.updateClass(req.params.id, {
      class_name: class_name.trim(),
      coach: coach.trim(),
      class_date: class_date.trim(),
      class_time: class_time.trim(),
      capacity: parseInt(capacity)
    });
    res.redirect(`/classes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to update class.' });
  }
});
 

router.post('/:id/delete', (req, res) => {
  try {
    req.db.classes.deleteClass(req.params.id);
    res.redirect('/classes');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to delete class.' });
  }
});
 
module.exports = router;