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
    var query = req.query.query;
    if(!query){
        res.send('<blockquote>  No Results Found</blockquote>');
        return;
    }
    var start = req.query.start;
    axios.get('https://www.google.com/search?q=' + req.query.query + '&btnG=Search&gbv=1' + '&start=' + start)
        .then(function(response){
            var $ = cheerio.load(response.data);
            var allUrls = [];
            var anchors = $('a');
            anchors.attr('href', function(i, url){
                var urls = url.split(/(\?q=)|(q=related:)|\&/gi)
                    .filter(function(token){
                    return token && (token.indexOf('http') === 0 || token.indexOf('www') === 0);
                }).map(function(url){
                    return url.trim();
                });
                allUrls.push(urls[0]);
                return urls[0];
            });
            anchors.attr('title', function(i, url){
                return allUrls[i];
            });
            res.send($.html('#ires'));
        })
        .catch(function(error){
            console.error(error);
        });
});
module.exports = router;
