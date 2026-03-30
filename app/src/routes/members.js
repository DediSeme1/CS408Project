const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  const members = req.db.members.getAllMembers();
  res.render('members/list', { members });
});


router.get('/add', (req, res) => {
  res.render('members/add');
});


router.post('/add', (req, res) => {
  const { first_name, last_name, email, phone_number, status } = req.body;
  req.db.members.createMember({ first_name, last_name, email, phone_number, status, join_date: new Date().toISOString().slice(0, 10) });
  res.redirect('/members');
});


router.get('/:id', (req, res) => {
  const member = req.db.members.getMemberById(req.params.id);
  res.render('members/detail', { member });
});


router.post('/:id/status', (req, res) => {
  req.db.members.updateMemberStatus(req.params.id, req.body.status);
  res.redirect(`/members/${req.params.id}`);
});


router.post('/:id/delete', (req, res) => {
  req.db.members.deleteMember(req.params.id);
  res.redirect('/members');
});

module.exports = router;