Character = require('../models').Character;
Monster = require('../models').Monster;

module.exports = function(req, res){
  if (!req.session.user || !req.session.character) {
    res.redirect("/");
  } else {
    Character.find(req.session.character).success(function(c) {
      /* Fix this */
      Monster.create({ name: 'DummyMonster' }).success(function(m) {
        res.render('battlescreen', { character: c, monster: m });
      });
    });
  }
};