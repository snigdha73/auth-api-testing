/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    bcrypt: true,
  },
});

app.use(express.json());

// eslint-disable-next-line new-cap
const User = new mongoose.model('User', userSchema);

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

app.get('/', (_req, res) => {
  // eslint-disable-next-line array-callback-return
  User.find((err, found) => {
    if (!err) {
      return res.status(200).json(found);
    }
    res.sendStatus(500);
  });
});

app.get('/:id', (req, res) => {
  User.findOne({ email: req.params.id }, (err, foundUser) => {
    if (err) {
      res.sendStatus(500);
    } else if (foundUser) {
      return res.status(200).json(
        foundUser.email,
      );
    } else {
      res.sendStatus(404);
    }
  });
});

app.post('/User/signup', (req, res) => {
  User.findOne({ email: req.body.email }, (err, found) => {
    if (err) {
      res.send(500);
    } else if (found) {
      res.json({ status: false, message: 'Already Registererd' });
    } else {
      bcrypt.hash(req.body.password, 8, (err, hash) => {
        if (err) {
          res.send(500);
        } else {
          const newUser = new User({
            email: req.body.email,
            password: hash,
          });

          newUser.save((err) => {
            if (err) {
              res.send(500);
            } else {
              res.json({ status: true, message: 'successfully registered' });
            }
          });
        }
      });
    }
  });
});

app.post('/User/signin', (req, res) => {
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (foundUser) {
      bcrypt.compare(req.body.password, foundUser.password, (
        err,
        result,
      ) => {
        if (err) {
          res.send(500);
        } else if (result === true) {
          bcrypt.hash(req.body.password, 8, (err, hash) => {
            if (err) {
              res.send(500);
            } else {
              const user = {
                email: req.body.email,
                password: hash,
              };

              jwt.sign({ user }, 'KEY', { expiresIn: '120s' }, (err, token) => {
                if (err) {
                  res.sendStatus(500);
                } else {
                  res.json({ status: true, token });
                }
              });
            }
          });
        } else {
          res.json({ status: false, message: 'password not match' });
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
});

app.patch('/User/changepassword', verifyToken, (req, res) => {
  if (!req.body.newpassword) { res.sendStatus(400); } else {
    jwt.verify(req.token, 'KEY', (
      err,
      authData,
    ) => {
      if (err) {
        res.sendStatus(401);
      } else {
        bcrypt.compare(req.body.password, authData.user.password, (
          err,
          result,
        ) => {
          if (err) {
            res.sendStatus(500);
          } else if (result === true) {
            bcrypt.hash(req.body.newpassword, 8, (err, hash) => {
              if (err) {
                res.sendStatus(500);
              } else {
                User.updateOne({ email: authData.user.email }, { $set: { password: hash } }, (err) => {
                  if (err) {
                    res.sendStatus(500);
                  } else {
                    res.json({ status: true, message: 'Changed password' });
                  }
                });
              }
            });
          } else { res.json({ status: false, message: 'old password not match' }); }
        });
      }
    });
  }
});

app.delete('/User/deleteUser', verifyToken, (req, res) => {
  jwt.verify(req.token, 'KEY', (
    err,
    authData,
  ) => {
    if (err) {
      res.sendStatus(401);
    } else {
      bcrypt.compare(req.body.password, authData.user.password, (
        err,
        result,
      ) => {
        if (err) {
          res.sendStatus(500);
        } else if (result === true) {
          User.deleteOne({ email: authData.user.email }, (err) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.json({ status: true, message: 'deleted' });
            }
          });
        } else { res.json({ staus: false, message: 'old password not match' }); }
      });
    }
  });
});

app.put('/User/id', verifyToken, (req, res) => {
  if (!req.body.newemail) { res.sendStatus(400); } else {
    jwt.verify(req.token, 'KEY', (
      err,
      authData,
    ) => {
      if (err) {
        res.sendStatus(401);
      } else {
        User.updateOne({ email: authData.user.email }, { $set: { email: req.body.newemail } }, (err) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json({ status: true, message: 'email changed successfully' });
          }
        });
      }
    });
  }
});

app.listen(8080);

export default app;
