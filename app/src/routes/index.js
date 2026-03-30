var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  const activeMembers = req.db.members.countActiveMembers();
  const totalCoaches = req.db.coaches.countAllCoaches();
  const weeklyClasses = req.db.classes.countWeeklyClasses();
  res.render('index', { title: 'CourtOps', activeMembers, totalCoaches, weeklyClasses });
});

module.exports = router;
