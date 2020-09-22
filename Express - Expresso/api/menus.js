const express = require('express');
const menuRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemRouter = require('./menu-items');

menuRouter.use('/:menuId/menu-items', menuItemRouter)

module.exports = menuRouter;

menuRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (err, menus) => {
    res.status(200).json({ menus: menus })
  })
})

menuRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    res.sendStatus(400);
  }
  db.run('INSERT INTO Menu(title) VALUES($title)', { $title: title }, function (err) {
    db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, menu) => {
      res.status(201).json({ menu: menu })
    })
  })
})

menuRouter.param('menuId', (req, res, next, id) => {
  db.get('SELECT * FROM Menu WHERE id = $id', { $id: id },
    (err, menu) => {
      if (err) {
        next(err)
      } else if (menu) {
        req.menu = menu;
        next()
      } else {
        res.sendStatus(404)
      }
    })
})

menuRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({ menu: req.menu })
})

menuRouter.put('/:menuId', (req, res, next) => {
  const menu = req.body.menu;
  const id = req.menu.id;
  const { title } = menu;
  if (!title) {
    res.sendStatus(400);
  }
  db.run('UPDATE Menu SET title = $title WHERE id = $id', { $id: id, $title: title }, function (err) {
    if (err) {
      res.sendStatus(404);
    }
    db.get('SELECT * FROM Menu WHERE id=$id', { $id: id }, (err, menu) => {
      res.status(200).json({ menu: menu })
    })
  })
})

menuRouter.delete('/:menuId', (req, res, next) => {
  const id = req.menu.id;
  db.run('DELETE FROM Menu WHERE id = $id', { $id: id }, function (err) {
    if (err) {
      res.sendStatus(404);
    }
    res.sendStatus(204);
  })
})

menuItemRouter.get('/', (req, res, next) => {
  console.log(req.menu.id)
  db.all('SELECT * FROM MenuItem WHERE menu_id = $id', { $id: req.menu.id }, (err, menuItems) => {
    console.log(menuItems)
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ menuItems: menuItems })
    }
  })
})

menuItemRouter.post('/', (req, res, next) => {
  const menuItem = req.body.menuItem;
  const name = menuItem.name;
  const description = menuItem.description;
  const inventory = menuItem.inventory;
  const price = menuItem.price;
  if (!name || !inventory || !price) {
    res.sendStatus(400)
  }
  db.run('INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $id)', { $name: name, $description: description, $inventory: inventory, $price: price, $id: req.menu.id },
    function (err) {
      if (err) {
        console.log(err)
        res.sendStatus(404);
      }
      db.get(`SELECT * FROM MenuItem WHERE id=${this.lastID}`, (err, menuItem) => {
        res.status(201).json({ menuItem: menuItem })
      })
    })
})

menuItemRouter.param('menuItemId', (req, res, next, id) => {
  db.get('SELECT * FROM MenuItem WHERE id = $id', { $id: id }, (err, menuItem) => {
    if (err) {
      next(err)
    } else if (menuItem) {
      req.menuItem = menuItem;
      next()
    } else {
      res.sendStatus(404);
    }
  })
})

menuItemRouter.put('/:menuItemId', (req, res, next) => {
  const menuItem = req.body.menuItem;
  const name = menuItem.name;
  const description = menuItem.description;
  const inventory = menuItem.inventory;
  const price = menuItem.price;
  if (!name || !inventory || !price) {
    res.sendStatus(400)
  }
  db.run('UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, id = $id)', { $name: name, $description: description, $inventory: inventory, $price: price, $id: req.menuItem.id },
    function (err) {
      if (err) {
        console.log(err)
        res.sendStatus(404);
      }
      db.get(`SELECT * FROM MenuItem WHERE id=$id`,{$id: req.menuItem.id}, (err, menuItem) => {
        res.status(201).json({ menuItem: menuItem })
      })
    })
})

menuItemRouter.delete('/:menuItemId', (req, res, next) => {
  db.run('DELETE FROM MenuItem WHERE id=$id',{$id: req.menuItem.id},(err) => {
    if(err) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  })
})
