const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectID;

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
      req.body.likes = { count: 0, person: [] };
      req.body.comments = [{ by: "", comment: "" }];
      req.body.name = req.body.name.trim();
      req.body.thought = req.body.thought.trim();
      col
        .insertOne(req.body)
        .then(result => {
          res.redirect("/");
        })
        .catch(err => {
          console.log(err);
        });
    });

    app.get("/", (req, res) => {
      col
        .find()
        .sort({ likes: -1 })
        .toArray()
        .then(result => {
          res.render("index.ejs", { thoughts: result });
        });
    });

    //to handle the get-comments request from fetch

    app.get("/get-comments/:id", (req, res) => {
      col.findOne({ _id : ObjectId(req.params.id) }).then(result => {
        res.render("commentModal.ejs", { data: result, id: req.params.id });
      });
    });

    //code to handle post request to add-comment
    app.put("/get-comments/add-comment", async (req, res) => {
      
      let commentsDoc = await col.findOne({ _id: ObjectId(req.body.id) });
      let comments = commentsDoc.comments;
    

      comments.push({ by: req.body.commentBy, comment: req.body.comment });

      col
        .updateOne({ _id: ObjectId(req.body.id) }, { $set: { comments: comments } })
        .then(result => {
          res.json("ok");
        })
        .catch(err => {
          console.log(err);
        });
    });
  
  
    // to handle the delete request from fetch
    app.delete("/del-thoughts", (req, res) => {
       console.log(req.body.id);
      col
        .deleteOne({
          _id: ObjectId(req.body.id)
        })
        .then(result => {
          
          res.json("Post is deleted");
        })
        .catch(err => {
          console.log(err);
        });
    });

    //code for handling the put request for the like button

    app.put("/addLike", async (req, res) => {
      let likesDoc = await col.findOne({ _id : ObjectId(req.body.id)});
      let likesCount = likesDoc.likes.count;
      let person = likesDoc.likes.person;
      if (!person.includes(req.body.person)) {
        person.push(req.body.person);

        col
          .updateOne(
            { _id : ObjectId(req.body.id) },
            { $set: { likes: { count: likesCount + 1, person: person } } }
          )
          .then(result => {
            res.json("Like Added");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        person = person.filter(p => {
          return p !== req.body.person;
        });

        col
          .updateOne(
            { _id : ObjectId(req.body.id)  },
            { $set: { likes: { count: likesCount - 1, person: person } } }
          )
          .then(result => {
            res.json("Like Removed");
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  })
  .catch(err => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(4000, () => {
  console.log("running at port 4000...");
});
