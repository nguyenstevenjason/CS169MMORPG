/*
 * GET users listing.
 */

User = require('../models').User;

exports.list = function(req, res){
  // res.send("respond with a resource");
	res.type('application/json');
	User.all().success(function(users) {
		res.json( {users: users} );
		res.send(200);
	});
};
