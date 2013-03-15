/* Test character creation and selection. */

var assert = require("assert");
var should = require("should");
var request = require("supertest");

var app = require("express");
User = require('../models').User;
Character = require('../models').Character;

/* TEST CREATING A CHARACTER */
describe.skip('createCharacter()', function(){
  it('should add a new Character if no existing Character has the same name', function(){
    // should.equal(Character.SUCCESS, res.err);
  })
  it('should not add a new Character with the same name as an existing Character', function(){
    // should.equal(Character.EXISTS_ERROR, res.err);
  })
  it('should not allow character name lengths < 1 or > 16', function(){
    // should.equal(Character.BAD_CHARACTER_ERROR, res.err);
  })
})

/* TEST SELECTING A CHARACTER */
describe.skip('selectCharacter()', function(){
  it('should update the session data upon success', function(){
    // should.equal(Character.SUCCESS, res.err);
  })
  it('should return error if no character was selected', function(){
    // should.equal(Character.NOT_SELECTED_ERROR, res.err);
  })
})

/* SKIP THESE TESTS */

describe.skip('Character', function(){
  describe('#createCharacter()', function(){
    it('should DO SOMETHING', function(){
      // add here
    })
  })
})

describe.skip('Character', function(){
  describe('#selectCharacter()', function(){
    it('should DO SOMETHING', function(){
      // add here
    })
  })
})

