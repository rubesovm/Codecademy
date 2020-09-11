const express = require('express');
const issuesRouter = express.Router({ mergeParams: true });
const sqlite = require('sqlite3');
const { use } = require('chai');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')

module.exports = issuesRouter;

issuesRouter.get('/', (req, res, next) => {
  const seriesId = req.params.seriesId;
  db.all('SELECT * FROM Issue WHERE series_id = $id', {
    $id: seriesId
  }, (e, i) => {
    if (e) {
      next(e);
    } else {
      res.status(200).json({ issues: i })
    }
  })
});

issuesRouter.post('/', (req, res, next) => {
  const name = req.body.issue.name;
  const number = req.body.issue.issueNumber;
  const date = req.body.issue.publicationDate;
  const artistId = req.body.issue.artistId;
  const seriesId = req.params.seriesId;
  if (!name || !number || !date || !artistId) {
    res.sendStatus(400);
  }
  db.run('INSERT INTO Issue(name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $number, $date, $artistId, $series_id);', {
    $name: name,
    $number: number,
    $date: date,
    $artistId: artistId,
    $series_id: seriesId
  }, function (error) {
    if (error) {
      res.sendStatus(404);
    }
    db.get(`SELECT * FROM Issue WHERE Issue.id = ${this.lastID};`, (e, i) => {
      res.status(201).json({ issue: i })
    })
  })
});

issuesRouter.param('issueId', (req, res, next, issueId) => {
  db.get('SELECT * FROM Issue WHERE Issue.id = $id;', {$id:issueId}, (e,i) => {
    if (e) {
      next(e);
    } else if (i) {
      req.issue = i;
      next();
    } else {
      res.sendStatus(404);
    }
  }
)})

issuesRouter.put('/:issueId', (req, res, next) => {
  const name = req.body.issue.name;
  const number = req.body.issue.issueNumber;
  const date = req.body.issue.publicationDate;
  const artistId = req.body.issue.artistId;
  const seriesId = req.params.seriesId;
  if (!name || !number || !date || !artistId) {
    res.sendStatus(400);
  }
  db.run('UPDATE Issue SET name = $name, issue_number = $number, publication_date = $date, artist_id = $artistId, series_id = $series_id;', {
    $name: name,
    $number: number,
    $date: date,
    $artistId: artistId,
    $series_id: seriesId
  }, function (error) {
    if (error) {
      res.sendStatus(404);
    }
    db.get(`SELECT * FROM Issue WHERE Issue.id = $id;`, {$id:req.issue.id}, (e, i) => {
      res.status(200).json({ issue: i })
    })
  })
});

issuesRouter.delete('/:issueId',(req,res,next) => {
  const id = req.params.issueId;
  db.run('DELETE FROM Issue WHERE Issue.id = $id', {$id:id}, (e) => {
    if(e) {
      next(e);
    }
    res.sendStatus(204);
  })
})