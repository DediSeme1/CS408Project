const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  const coaches = req.db.coaches.getAllCoaches();
  res.render('coaches/list', { coaches });
});


router.get('/add', (req, res) => {
  res.render('coaches/add');
});


router.post('/add', (req, res) => {
  const { first_name, last_name, email, phone_number, specialty } = req.body;
  req.db.coaches.createCoach({ first_name, last_name, email, phone_number, specialty, join_date: new Date().toISOString().slice(0, 10) });
  res.redirect('/coaches');
});


router.get('/:id', (req, res) => {
  const coach = req.db.coaches.getCoachById(req.params.id);
  res.render('coaches/detail', { coach });
});


router.post('/:id/status', (req, res) => {
  req.db.coaches.updateCoach(req.params.id, req.body.status);
  res.redirect(`/coaches/${req.params.id}`);
});


router.post('/:id/delete', (req, res) => {
  req.db.coaches.deleteCoach(req.params.id);
  res.redirect('/coaches');
});

module.exports = router;