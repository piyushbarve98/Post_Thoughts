const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//database connection
const MongoClient = require("mongodb").MongoClient;
app.use(bodyParser.json());

MongoClient.connect(
  "mongodb+srv://myexpressapp:piyush123@mycluster.evnrp.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(client => {
    console.log("connected to database");
    const mydb = client.db("mydb");
    const col = mydb.collection("thoughts");
    
  //this is to handle the post request sent when submit button is clicked
    app.post("/thoughts", (req, res) => {
      col
        .insertOne(req.body)
        .then(result => {
          res.redirect("/");
        })
        .catch(err => {
          console.log(err);
        });
    });
  
  app.get("/",(req,res)=>{
    col.find().toArray().then((result)=>{
      // console.log(result);
    
      res.render('index.ejs', {thoughts: result});
    
      
    });
    
    });
  
  // to handle the delete request from fetch 
  app.delete("/del-thoughts", (req, res) => {
    console.log(req.body);
      col
        .deleteOne(
        {
          name: req.body.name
        }
      )
        .then(result => {
          console.log('post deleted');
          res.json('Post is deleted');
        })
        .catch(err => {
          console.log(err);
        });
    });
  
  })
  .catch(err => {
    console.log(err);
  });

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));



app.listen(4000, () => {
  console.log("running at port 4000...");
});
