var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var app = express();
var neo4j = require("neo4j-driver").v1;


//view Engine

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "250daowohao"));
var session = driver.session();


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});





app.post("/",function(req,res){  //Because in HTML, the url we are posting is http:localhost:3000/  There is no prefix address , so here we just use "/" .
  var title = req.body.title;    // fetch the Json data from html ajax
  //var year  = req.body.year;

  console.log(title);

  session
      .run(" MERGE (n:Movie { title:{titleParam}  }) RETURN n.title",{titleParam:title} )
      .then(function(result){
        console.log(n.title);
        res.redirect("/");
        session.close();

      })
      .catch(function(err){
        console.log(err);

      })



  res.redirect("/");

});




app.listen(3000);

console.log("server started on port 3000");

module.exports = app;

/*

app.get("/",function(req,res){

  session
  .run("MATCH (m :Movie) RETURN m LIMIT 25")
  .then(function(result){
    var movieArr = [];

    result.records.forEach(function(record) {
      movieArr.push({
        id:record._fields[0].identity.low,
        title:record._fields[0].properties.title,
        year: record._fields[0].properties.year
      });
      
    });

    res.render("index",{
      movies:movieArr
    });

  })
  .catch(function(error) {
    console.log(error);
  });


  
});
*/
