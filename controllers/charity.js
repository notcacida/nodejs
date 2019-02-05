const Charity = require('../models/charity');

exports.getCharities = (req, res) => {
  //console.log("trest")
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
  //console.log(req);
  Charity.updateCharity(id, charity, {}, (err, charity) => {
    if (err) throw err;
    res.json(product);
  });
};

exports.deleteCharity = (req, res) => {
  var id = req.params._id;
  //var book = req.body;
  //console.log(req);
  Charity.removeCharity(req.params._id, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};
