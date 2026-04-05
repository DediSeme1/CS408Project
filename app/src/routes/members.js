const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  try {
    const members = req.db.members.getAllMembers();
    res.render('members/list', { members });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load members.' });
  }
});


router.get('/add', (req, res) => {
  res.render('members/add', { errors: [], formData: {} });
});


router.post('/add', (req, res) => {
  const { first_name, last_name, email, phone_number, status } = req.body;

  const errors = [];
  if (!first_name?.trim()) errors.push('First name is required.');
  if (!last_name?.trim())  errors.push('Last name is required.');
  if (!email?.trim())      errors.push('Email is required.');
  if (!phone_number?.trim()) errors.push('Phone number is required.');
  if (!['Active', 'Inactive'].includes(status)) errors.push('Valid status is required.');

  if (errors.length > 0) {
    return res.render('members/add', { errors, formData: req.body });
  }

  try {
    req.db.members.createMember({
      first_name, last_name, email, phone_number, status,
      join_date: new Date().toISOString().slice(0, 10)
    });
    res.redirect('/members');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to add member.' });
  }
});


router.get('/:id', (req, res) => {
  try {
    const member = req.db.members.getMemberById(req.params.id);
    if (!member) return res.status(404).render('error', { message: 'Member not found.' });
    res.render('members/detail', { member });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load member.' });
  }
});


router.post('/:id/status', (req, res) => {
  if (!['Active', 'Inactive'].includes(req.body.status)) {
    return res.status(400).render('error', { message: 'Invalid status value.' });
  }
  try {
    req.db.members.updateMemberStatus(req.params.id, req.body.status);
    res.redirect(`/members/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to update status.' });
  }
});


router.post('/:id/delete', (req, res) => {
  try {
    req.db.members.deleteMember(req.params.id);
    res.redirect('/members');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to delete member.' });
  }
});

module.exports = router;