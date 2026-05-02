const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  try {
    const coaches = req.db.coaches.getAllCoaches();
    res.render('coaches/list', { coaches });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load coaches.' });
  }
});


router.get('/add', (req, res) => {
  res.render('coaches/add', { errors: [], formData: {} });
});


router.post('/add', (req, res) => {
  const { first_name, last_name, email, phone_number, speciality } = req.body;

  const errors = [];
  if (!first_name?.trim())    errors.push('First name is required.');
  if (!last_name?.trim())     errors.push('Last name is required.');
  if (!email?.trim())         errors.push('Email is required.');
  if (!phone_number?.trim())  errors.push('Phone number is required.');
  if (!speciality?.trim())    errors.push('Specialty is required.');

  if (errors.length > 0) {
    return res.render('coaches/add', { errors, formData: req.body });
  }

  try {
    req.db.coaches.createCoach({
      first_name, last_name, email, phone_number, speciality,
      join_date: new Date().toISOString().slice(0, 10)
    });
    res.redirect('/coaches');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to add coach.' });
  }
});


router.get('/:id', (req, res) => {
  try {
    const coach = req.db.coaches.getCoachById(req.params.id);
    if (!coach) return res.status(404).render('error', { message: 'Coach not found.' });
    const editMode = req.query.edit === 'true';
    res.render('coaches/detail', { coach, editMode, errors: [] });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load coach.' });
  }
});


router.post('/:id/edit', (req, res) => {
  const { first_name, last_name, email, phone_number, speciality } = req.body;

  const errors = [];
  if (!first_name?.trim())    errors.push('First name is required.');
  if (!last_name?.trim())     errors.push('Last name is required.');
  if (!email?.trim())         errors.push('Email is required.');
  if (!phone_number?.trim())  errors.push('Phone number is required.');
  if (!speciality?.trim())    errors.push('Specialty is required.');

  if (errors.length > 0) {
    try {
      const coach = req.db.coaches.getCoachById(req.params.id);
      return res.render('coaches/detail', { coach, errors, editMode: true });
    } catch (err) {
      return res.status(500).render('error', { message: 'Failed to load coach.' });
    }
  }

  try {
    req.db.coaches.updateCoach(req.params.id, { first_name, last_name, email, phone_number, speciality });
    res.redirect(`/coaches/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to update coach.' });
  }
});


router.post('/:id/delete', (req, res) => {
  try {
    req.db.coaches.deleteCoach(req.params.id);
    res.redirect('/coaches');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to delete coach.' });
  }
});

module.exports = router;