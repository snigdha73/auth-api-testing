/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable import/named */
import mongoose from 'mongoose';

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

const User = new mongoose.model('User', userSchema);

class getController {
  static getAllUser(req, res) {
    // eslint-disable-next-line array-callback-return
    User.find((err, found) => {
      if (!err) {
        return res.status(200).json(found);
      }
      return res.sendStatus(500);
    });
  }

  static getUserById(req, res) {
    User.findOne({ email: req.params.id }, (err, foundUser) => {
      if (err) {
        res.sendStatus(500);
      } else if (foundUser) {
        return res.status(200).json(
          foundUser.email,
        );
      } else {
        return res.sendStatus(404);
      }
    });
  }
}

export default getController;
