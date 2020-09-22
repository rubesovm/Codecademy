const express = require('express');
const empRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const timeRouter = require('./timesheets');

empRouter.use('/:employeeId/timesheets',timeRouter);

module.exports = empRouter;

empRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Employee WHERE is_current_employee = 1', (err, emp) => {
    res.status(200).json({ employees: emp });
  })
})

empRouter.post('/', (req, res, next) => {
  const employee = req.body.employee;
  const { name, position, wage } = employee;
  if (!name || !position || !wage) {
    res.sendStatus(400);
  }
  db.run('INSERT INTO Employee(name, position, wage, is_current_employee) VALUES ($name, $position, $wage, 1)', {
    $name: name,
    $position: position,
    $wage: wage
  }, function (err) {
    if (err) {
      res.sendStatus(400);
    }
    db.get(`SELECT * FROM Employee WHERE id = ${this.lastID} `, (err, emp) => {
      res.status(201).json({ employee: emp })
    })
  })
})

empRouter.param('employeeId', (req, res, next, id) => {
  db.get('SELECT * FROM Employee WHERE id = $id', { $id: id },
    (err, emp) => {
      if (err) {
        next(err)
      } else if (emp) {
        req.employee = emp;
        next()
      } else {
        res.sendStatus(404)
      }
    })
})

empRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee: req.employee})
})

empRouter.put('/:employeeId', (req, res, next) => {
  const employee = req.body;
  console.log(employee);
  const id = req.employee.id;
  const { name, position, wage } = employee;
  if (!name || !position || !wage) {
    console.log('ha')
    res.sendStatus(400);
  }
  db.run('UPDATE Employee SET name = $name, position = $position, wage=$wage WHERE id = $id',{$id:id, $name: name, $position: position, $wage: wage}, function(err) {
    if(err){
      res.sendStatus(404);
    }
    db.get('SELECT * FROM Employee WHERE id=$id',{$id:id},(err,emp) => {
      res.status(200).json({employee: emp})
    })
  })
})

empRouter.delete('/:employeeId', (req, res, next) => {
  const id = req.employee.id;
  db.run('UPDATE Employee SET is_current_employee = 0 WHERE id = $id',{$id:id}, function(err) {
    if(err){
    }
    db.get('SELECT * FROM Employee WHERE id=$id',{$id:id},(err,emp) => {
      res.status(200).json({employee: emp})
    })
  })
})

timeRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Timesheet WHERE employee_id = $id',{$id: req.employee.id}, (err, time) => {
    res.status(200).json({ timesheets: time });
  })
})

timeRouter.post('/', (req, res, next) => {
  const timesheet = req.body.timesheet;
  const id = req.employee.id;
  const { hours, rate, date } = timesheet;
  if (!hours || !rate || !date) {
    res.sendStatus(400);
  }
  db.run('INSERT INTO Timesheet(hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $id)', {
    $hours: hours,
    $rate: rate,
    $date: date,
    $id: id
  }, function (err) {
    if (err) {
      res.sendStatus(400);
    }
    db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID} `, (err, time) => {
      res.status(201).json({ timesheet: time })
    })
  })
})

timeRouter.param('timesheetId', (req, res, next, id) => {
  db.get('SELECT * FROM Timesheet WHERE id = $id', { $id: id },
    (err, time) => {
      if (err) {
        next(err)
      } else if (time) {
        req.timesheet = time;
        next()
      } else {
        res.sendStatus(404)
      }
    })
})

timeRouter.put('/:timesheetId', (req, res, next) => {
  const timesheet = req.body.timesheet;
  const id = req.timesheet.id;
  const { hours, rate, date } = timesheet;
  if (!hours || !rate || !date) {
    res.sendStatus(400);
  }
  db.run('UPDATE Timesheet SET hours = $hours, rate = $rate, date=$date WHERE id = $id',{$id:id, $hours: hours, $rate: rate, $date: date}, function(err) {
    if(err){
      res.sendStatus(404);
    }
    db.get('SELECT * FROM Timesheet WHERE id=$id',{$id:id},(err,time) => {
      res.status(200).json({timesheet: time})
    })
  })
})

timeRouter.delete('/:timesheetId', (req, res, next) => {
  const id = req.timesheet.id;
  db.run('DELETE FROM Timesheet WHERE id = $id',{$id:id}, function(err) {
      res.sendStatus(204);
  })
})