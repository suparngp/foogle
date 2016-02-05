var express = require('express');
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
/* GET users listing. */
router.get('/complete', function(req, res, next) {
  console.log(req.query);
  var q = req.query.query;
  var url = "https://www.google.com/complete/search?sclient=psy-ab&site=&source=hp&q=" + q;
  axios.get(url)
      .then(function(response){
        res.send(response.data[1]);
      })
      .catch(function(error){
        console.error(error);
      });

});


router.get('/search', function(req, res, next){

    axios.get('https://www.google.com/search?q=' + req.query.query)
        .then(function(response){
            var results = cheerio.load(response.data)('body').html();
            res.send(results);
        })
        .catch(function(error){
            console.error(error);
        });
});
module.exports = router;
