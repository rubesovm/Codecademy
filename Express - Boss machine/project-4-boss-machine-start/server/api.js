const express = require('express');
const { createMeeting,
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase } = require('./db.js');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const apiRouter = express.Router();

//Minions
apiRouter.get('/minions', (req, res, next) => {
  res.send(getAllFromDatabase('minions'));
});

apiRouter.post('/minions', (req, res, next) => {
  const newMinion = addToDatabase('minions', req.body)
  if (newMinion) {
    res.status(201).send(newMinion);
  };
});

apiRouter.get('/minions/:minionId', (req, res, next) => {

  const minion = getFromDatabaseById('minions', req.params.minionId);
  if (minion && Number(req.params.minionId)) {
    res.send(minion);
  } else {
    res.sendStatus(404);
  }
});

apiRouter.put('/minions/:minionId', (req, res, next) => {
  const updatedMinion = updateInstanceInDatabase('minions', req.body);
  if (Number(req.body.id) && updatedMinion) {
    res.status(201).send(updatedMinion);
  } else {
    res.sendStatus(404);
  }
});

apiRouter.delete('/minions/:minionId', (req, res, next) => {
  const deleted = deleteFromDatabasebyId('minions', req.params.minionId)
  if (deleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

//Ideas
apiRouter.get('/ideas', (req, res, next) => {
  res.send(getAllFromDatabase('ideas'));
});

apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
  const newIdea = addToDatabase('ideas', req.body);
  res.status(201).send(newIdea);
});

apiRouter.get('/ideas/:ideaId', (req, res, next) => {
  const idea = getFromDatabaseById('ideas', req.params.ideaId);
  if (idea && Number(req.params.ideaId)) {
    res.send(idea);
  } else {
    res.sendStatus(404);
  }
});

apiRouter.put('/ideas/:ideaId', (req, res, next) => {
  const updatedIdea = updateInstanceInDatabase('ideas', req.body);
  if (updatedIdea) {
    res.status(201).send(updatedIdea);
  } else {
    res.sendStatus(404);
  }
});

apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
  if (deleteFromDatabasebyId('ideas', req.params.ideaId)) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

//Meetings
apiRouter.get('/meetings', (req, res, next) => {
  res.send(getAllFromDatabase('meetings'));
});

apiRouter.post('/meetings', (req, res, next) => {
  const newMeeting = addToDatabase('meetings', createMeeting());
  res.status(201).send(newMeeting);
});

apiRouter.delete('/meetings', (req, res, next) => {
  deleteAllFromDatabase('meetings');
  res.sendStatus(204);

});


module.exports = apiRouter;
