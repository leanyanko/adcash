var express = require("express");

var routes = function(Company) {
    var companyRouter = express.Router();
    var companyController = require("../controllers/companyController")(Company);

    companyRouter
        .route("/")
        .get(companyController.get)
    
      return companyRouter;
};

module.exports = routes;
