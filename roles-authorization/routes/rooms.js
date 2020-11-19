const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

const {loginCheck} = require('./middlewares')


// if the logincheck failes ,w e dont' call next (was wäre dass die route weiter läuft), sondern werden auf die loginseite umgeleitet und req, res, next etc von routes.get/ wird nicht getriggert
router.get('/', loginCheck(), (req, res, next) => {
  //oder show all the rooms // geht nur das hier oder der block darunter, nicht beide
  Room.find()
    .then(rooms => {
      res.render('rooms/index', { roomsList: rooms })
    })
    .catch(error => {
      next(error);
    });
  // only show the rooms that the logged in user created
  // Room.find({ owner: req.user._id }).then(rooms => {
  //   res.render('rooms/index', { roomsList: rooms })
  // })
  //   .catch(err => {
  //     next(err);
  //   })
  })




router.get('/add', (req, res) => {
  res.render('rooms/add');
});

router.post('/', (req, res, next) => {

//if you are not authenticated then you are redirected to /rooms
 // if (!req.isAuthenticated()) {
  //   res.redirect('/rooms');
  // }
  const { price, name, description } = req.body;
  Room.create({
    price,
    name,
    description,
    owner req.user._id // in req.user parkt passport die IDs // wenn es basic auth wäre wäre es req.session.user
  })
    .then(room => {
      res.redirect('/rooms')
    })
    .catch(error => {
      next(error);
    })
});


router.get('/romms/:id', (req, res) => {
  // an admin can delete any room.
  // a user can only delete a room that they created
  const query = {_id: req.params.id};
  // so könnte jede:r alles löschen, daher noch das IF
  if (req.user.role !== 'admin') {
    query.owner = req.user._id
  }
  Room.findByIdAndDelete(query)
  .then(() => {
    res.redirect('/rooms')
  })
  .catch(err => {
    next(err);
  })
})

module.exports = router;