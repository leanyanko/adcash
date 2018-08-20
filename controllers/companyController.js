var winston = require('../config/winston');

var companyController = function(Company) {

  var get = function(req, res) {

    var allCompanies = [];

    var query = {};
    if (req.query.countrycode) {
      query.countrycode = req.query.countrycode;
    }
    if (req.query.Category) {
      query.Category = req.query.Category;
    }
    if (req.query.companyID) {
      query.companyID = req.query.companyID;
    }

    if (!req.query.BaseBid) res.status(500).send("No bid specifyed");
    var baseBid = Number(req.query.BaseBid); 
    var winner = {};

    Company.find(function(err, companies) {
        if (err) res.status(500).send(err);
        else {
          allCompanies = companies;
          return;
        }
      })
      .then(() => {
        console.log("all companies", allCompanies);

        Company.find(query, function(err, companies) {
          msg = "query" + JSON.stringify(query) + ", baseBid: " + baseBid;
          winston.log('info', msg);
          
          if (err) res.status(500).send(err);
          else {
            if (companies.length === 0) {
              res.send("No Companies Passed from Targeting");
            } 
            else {
              
              var budgetCheck = "BudgetCheck: ";
              var bidCheck = "BaseBid: ";
              msg = "BaseTargeting: ";
              
              for (var i = 0; i < allCompanies.length; i++) {
                var company = allCompanies[i];
                var id = company.companyID;
                
                var passed = "{" + id + ", Passed} \n";
                var failed = "{" + id + ", Failed} \n";
                if (companies.filter((c) => c.companyID === id).length > 0) {
                  msg += passed;
                  
                  //assumed that BudgetCheck only needs for companies which passed Targeting
                  //also assumed that Budget should be greater than bid
                  if (company.Budget*100 >= baseBid) {
                    budgetCheck += passed;
                    if (company.BaseBid >= baseBid) bidCheck += passed;
                    else bidCheck += failed;
                  }
                  else budgetCheck += failed;
                }
                else {
                  msg += failed;
                }
              }

              //logs
              winston.log('info', msg);
              if (budgetCheck.indexOf('Passed') < 0) res.send("No Companies Passed from BudgetCheck");
              winston.log('info', budgetCheck);
              winston.log('info', bidCheck);

              //baseBid check
              var passedBid = companies.filter((company) => company.BaseBid >= baseBid);
              winner = passedBid[0];
              
              //winner
              for (var i = 1; i < passedBid.length; i++) {
                if (winner.BaseBid < passedBid[i].BaseBid) winner = passedBid[i];
              }
              msg = "Winner is: " + winner.companyID;
              winston.log('info', msg);
            }
            res.json(winner.companyID);
            console.log('after send');
            winner.Budget = (winner.Budget*100 - baseBid)/100;
            winner.save();
          }
        });
      })

  };

  return {
    get: get
  };
};

module.exports = companyController;
