const express = require('express');
const seriesRouter = express.Router();
const issuesRouter = require('./issues')
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')

seriesRouter.use('/:seriesId/issues', issuesRouter);

module.exports = seriesRouter;

seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (e, s) => {
    if (e) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ series: s })
    }
  })
})

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  db.get('SELECT * FROM Series WHERE Series.id = $id', {
    $id: seriesId
  }, (e, s) => {
    if (e) {
      next(e)
    } else if (s) {
      req.series = s;
      next();
    } else {
      res.sendStatus(404);
    }
  })
})

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({ series: req.series })
})

seriesRouter.post('/', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  if (!name || !description) {
    res.sendStatus(400);
  }
  db.run('INSERT INTO Series(name, description) VALUES ($name, $description);', {
    $name: name,
    $description: description
  }, function (e) { // the arrow function is forbidden here!!
    if (e) {
      res.sendStatus(404);
    }
    db.get(`SELECT * FROM Series WHERE Series.id = ${this.lastID};`, (e, s) => {
      res.status(201).json({ series: s })
    })
  })
})

seriesRouter.put('/:seriesId', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  if (!name || !description) {
    res.sendStatus(400);
  }
  db.run('UPDATE Series SET name = $name, description = $description WHERE id = $id', {
    $id: req.series.id,
    $name: name,
    $description: description
  }, (e) => {
    if (e) {
      res.sendStatus(404)
    }
    db.get('SELECT * FROM Series WHERE id = $id', {
      $id: req.series.id
    }, (e, s) => {
      res.status(200).json({ series: s })
    })
  })
})

seriesRouter.delete('/:seriesId', (req, res, next) => {
  const id = req.params.seriesId;
  db.get('SELECT * FROM Issue WHERE Issue.series_id = $id', { $id: id }, (e, i) => {
    if (e) {
      next(e)
    } else if (i) {
      res.sendStatus(400);
    } else {
      db.run('DELETE FROM Series WHERE id = $id', { $id: id }, (e) => {
        if (e) {
        next(e);
        }
        res.sendStatus(204);
      }
      )
    }
  }
  )
})