User = require('./models').User;
Area = require('./models').Area;
Class = require('./models').Class;
Character = require('./models').Character;
Monster = require('./models').Monster;
Item = require('./models').Item;

// in the future, we will store area type ("forest", "mountain") and bitmap as fields of an Area instance
var smallArea = "FACBAABACCBBABCAAABBABAABC";
var largeArea = "F";

for (var i = 0; i < 20*20; i++) {
  largeArea += "A";
}

var forest =                                            "FBBBBBBBBBBBBBBBBBBBB" + 
							"BCAAAAAAAAAAAAAAAAAB" +
							"BBBBBBBBBBBBBBBBBBAB" +
							"BAAAAAAAAAAAAAAAAAAB" +
							"BABBBBBBBBBBBBBBBBBB" + //5
							"BAAAAAAAAAAAAAAAAAAB" +
							"BBBBBBBBBBBBBBBBBBAB" +
							"BAAAAAAAAAAAAAAAAAAB" +
							"BABBBBBBBBBBBBBBBBBB" +
							"BAAAAAAAAAAAAAAAAAAB" + //10
							"BBBBBBBBBBBBBBBBBBAB" +
							"BAAAAAAAAAAAAAAAAAAB" +
							"BABBBBBBBBBBBBBBBBBB" +
							"BAAAAAAAAAAAAAAAAAAB" +
							"BBBBBBBBBBBBBBBBBBAB" + //15
							"BAAAAAAAAAAAAAAAAAAB" +
							"BABBBBBBBBBBBBBBBBBB" +
							"BABBBBBBBBBBBBBBBBBB" +
							"BAAAAAAAAAAAAAAAAACB" +
							"BBBBBBBBBBBBBBBBBBBB";
	      
var mountain =                                                   "MBBBBBBBBBBBBBBBBBBBB" + 
								 "BCAAAAAAAAAAAAAAAAAB" +
								 "BBBBBBBBBBBBBBBBBBAB" +
								 "BAAAAAAAAAAAAAAAABAB" +
								 "BABBBBBBBBBBBBBBABAB" + //5
								 "BABAAAAAAAAAAAABABAB" +
								 "BABABBBBBBBBBBABABAB" +
								 "BABABAAAAAAAABABABAB" +
								 "BABABABBBBBBABABABAB" +
								 "BABABABAAAABABABABAB" + //10
								 "BABABABABCABABABABAB" +
								 "BABABABABBBBABABABAB" +
								 "BABABABAAAAAABABABAB" +
								 "BABABABBBBBBBBABABAB" +
								 "BABABAAAAAAAAAABABAB" + //15
								 "BABABBBBBBBBBBBBABAB" +
								 "BABAAAAAAAAAAAAAABAB" +
								 "BABBBBBBBBBBBBBBBBAB" +
								 "BAAAAAAAAAAAAAAAAAAB" +
								 "BBBBBBBBBBBBBBBBBBBB";

var defaultArea = forest; // the area we want to use for overworld
var AREA_WIDTH = Math.floor(Math.sqrt(defaultArea.length)); // x-dimension size
var AREA_HEIGHT = Math.floor(Math.sqrt(defaultArea.length)); // y-dimension size
var TILE_SIZE = Math.floor(500/(Math.sqrt(defaultArea.length))); // side of a single area tile

module.exports = function(err, socket, session) {
  if (!session || !session.user || !session.character) {
    socket.disconnect();
    return;
  }

  socket.join('area_name');

  socket.on('getmap', function(data) {
    Character.find(session.character).success(function(c) {
	if (c.location == 'forest') {
            socket.emit('getmap', {areamap: forest, areaname: 'forest'});
	} else if (c.location == 'mountain') {
	    socket.emit('getmap', {areamap: mountain, areaname: 'mountain'});
	} else if (c.location == 'smallArea') {
	    socket.emit('getmap', {areamap: smallArea, areaname: 'smallArea'});
	} else if (c.location == 'largeArea') {
	    socket.emit('getmap', {areamap: largeArea, areaname: 'largeArea'});
	}
    });
  });

    socket.on('getportals', function(data) {
	socket.emit('getportals', { forest: [{ xpos: 1, ypos: 1, destination: 'mountain' }, { xpos: 18, ypos: 18, destination: 'mountain' }], mountain: [{ xpos: 1, ypos: 1, destination: 'forest' }, { xpos: 9, ypos: 10, destination: 'forest' }], smallArea: [{}], largeArea: [{}] });
    });

  socket.on('move', function(data) {
    Character.find(session.character).success(function(c) {
      if (data.xpos >= 0 && data.xpos < AREA_WIDTH && data.ypos >= 0 && data.ypos < AREA_HEIGHT) {
        c.xpos = data.xpos;
        c.ypos = data.ypos;
        c.location = data.location;
        c.save();
        io.sockets.in('area_name').emit('move', { name: c.name, xpos: c.xpos, ypos: c.ypos, location: c.location });
      }
    });
  });

  socket.on('name', function(data) {
    Character.find(session.character).success(function(c) {
      socket.emit('name', {name: c.name});
    });
  });

  socket.on('disconnect', function() {
  });

  socket.on('save', function(data) {
    Character.find(session.character).success(function(c) {
      character = data.c;
      c.current_health_points = character.current_health_points;
      // c.level = character.level;
      // c.experience = character.experience;
      c.save();
    });
  });

  /* TESTING */
  socket.on('getbattlers', function(data) {
    Character.find(session.character).success(function(c) {
      Monster.findAll().success(function(monsters) {
        if (monsters.length == 0) {
          socket.emit('getbattlers', {err: 500});
        } else {
      	  var randomMonsterID = Math.floor((Math.random() * monsters.length) + 1);
          Monster.find({where: {id: randomMonsterID}}).success(function(m) {
      	    c.setMonster(m);
            c.current_monster_health = m.health_points;
            c.current_monster_magic = m.magic_points;
            c.save().success(function() {
              socket.emit('getbattlers', { character: c, monster: m });
            });
          });
        }
      });
    });
  });
}
