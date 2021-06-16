/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import express from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getController from './controllers/getcontrollers.js';

const app = express();

app.use(express.json());

// eslint-disable-next-line new-cap

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.send({ status: false, message: 'forbidden or token expired' });
  }
}
app.get('/', getController.getAllUser);
app.get('/:id', getController.getUserById);
app.listen(8080);

export default app;
