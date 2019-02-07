const Charity = require('../models/charity');

exports.getCharities = (req, res) => {
  Charity.getCharities((err, charities) => {
    if (err) throw err;
    res.json(charities);
  });
};

exports.getCharityPerId = (req, res) => {
  Charity.getCharityById(req.params._id, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};

exports.postCharity = (req, res) => {
  var charity = req.body;
  Charity.addCharity(charity, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};

exports.putCharityById = (req, res) => {
  var id = req.params._id;
  var charity = req.body;
  const uName = req.body.name;
  const uDescription = req.body.description;
  Charity.findById(id)
    .then(charity => {
      charity.name = uName || charity.name;
      charity.description = uDescription || charity.description;
      charity.save();
      return charity;
    })
    .then(charity => {
      res.send(charity);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.deleteCharity = (req, res) => {
  var id = req.params._id;
  //var book = req.body;
  Charity.removeCharity(req.params._id, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};
