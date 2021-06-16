import User from './Dbconnect';

class getController {
  static getAllUser(req, res) {
    User.find((err, found) => {
      if
      (!err) {
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
      }
      return res.sendStatus(404);
    });
  }
}

export default getController;
