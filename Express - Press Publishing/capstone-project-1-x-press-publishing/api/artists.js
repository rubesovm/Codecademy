const express = require('express');
const sqlite = require('sqlite3');
const artistRouter = express.Router();
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

//this is a router param function and it is useful for avoiding repeating of the code, with this piece of code we can track id of given artist - so that it can be used for PUT, GET and DELETE routes
artistRouter.param('artistId', (req, res, next, artistId) => {
  db.get('SELECT * FROM Artist WHERE Artist.id = $id;', { $id: artistId }, (err, artist) => {
    if (err) {
      next(err);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.status(404).send();
    }
  })
});

artistRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE Artist.is_currently_employed = 1', (err, artist) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ artists: artist });
    }
  })
})

artistRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({ artist: req.artist });
});

artistRouter.post('/', (req, res, next) => {
  const artist = req.body.artist;
  if (!artist.name || !artist.dateOfBirth || !artist.biography) {
    res.sendStatus(400);
  }
  db.run('INSERT INTO Artist(name, date_of_birth, biography, is_currently_employed) VALUES ($name, $date, $bio, $emp);', {
    $name: artist.name,
    $date: artist.dateOfBirth,
    $bio: artist.biography,
    $emp: 1
  }, function (error) {
    if (error) {
      res.sendStatus(404);
    }
    db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID};`, (e, a) => {
      res.status(201).json({ artist: a })
    })
  })
});

artistRouter.put('/:artistId', (req, res, next) => {
  const artist = req.body.artist;
  if (!artist.name || !artist.dateOfBirth || !artist.biography) {
    console.log('nevraci?')
    res.sendStatus(400);
  }
  db.run('UPDATE Artist SET name = $name, date_of_birth = $date, biography = $bio, is_currently_employed = $emp WHERE Artist.id = $id;', {
    $name: artist.name,
    $date: artist.dateOfBirth,
    $bio: artist.biography,
    $emp: artist.isCurrentlyEmployed,
    $id: req.artist.id
  }, (error) => {
    if (error) {
      return res.sendStatus(404);
    }
    db.get(`SELECT * FROM Artist WHERE Artist.id = $id;`, { $id: req.artist.id }, (e, a) => {
      res.status(200).json({artist: a})
    })
  })
})

artistRouter.delete('/:artistId', (req, res, next) => {
  db.run('UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $id;', {
    $id: req.artist.id
  }, (error) => {
    if (error) {
      res.sendStatus(404);
    }
    db.get(`SELECT * FROM Artist WHERE Artist.id = $id;`, { $id: req.artist.id }, (e, a) => {
      res.status(200).json({ artist: a })
    })
  })
});








  module.exports = artistRouter;