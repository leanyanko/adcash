var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var company = new Schema({
  companyID: {
    type: String
  },
  countrycode: {
    type: [String]
  },
  Budget: {
    type: Number
  },
  BaseBid: {
    type: Number
  },
  Category: {
    type: [String]
  }
});

module.exports = mongoose.model("company", company);