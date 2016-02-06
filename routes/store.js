var mongo = require('mongodb');
 var bson = require("bson");
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = bson.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('pof', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'user' (store.js) database");
        db.collection('print', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'user' (store.js) collection doesn't exist."+ err);
            } 
        });
    }
});


var fs = require('fs');
var path = require('path');
var uid = require('uid2');
var mime = require('mime');
var multiparty = require('multiparty');
var util = require('util');

var TARGET_PATH = path.resolve(__dirname, '../writable/');  
var IMAGE_TYPES = ['image/jpeg', 'image/png' , 'application/msword ' , 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' , 'application/vnd.ms-powerpointtd' , 'application/vnd.openxmlformats-officedocument.presentationml.presentation' , 'application/pdf']; 

exports.upload = function(req, res) {

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields['title']);
    var is;
    var os;
    var targetPath;
    var targetName;
    var tempPath = files.theFile[0].path;
    var type = mime.lookup(files.theFile[0].path);
    var extension = files.theFile[0].path.split(/[. ]+/).pop();
    if (IMAGE_TYPES.indexOf(type) == -1) {
      res.redirect("/add?msg=0");
    }
    targetName = uid(22) + '.' + extension;
    targetPath = path.join(TARGET_PATH, targetName);
    is = fs.createReadStream(tempPath);
    os = fs.createWriteStream(targetPath);
    is.pipe(os);
    is.on('error', function() {
      if (err) {
        res.redirect("/add?msg=Something went wrong, try again!");
      }
    });
    is.on('end', function() {
      fs.unlink(tempPath, function(err) {
        if (err) {
          res.redirect("/add?msg=Something went wrong, try again!");
        }
        else{
          var currentdate = new Date(); 
        var date = currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear();
              var time =  currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();
              var datetime = date+" at "+time;

          var temp = {"title":fields['title'][0],"copies":fields['cpy'][0],"info":fields['info'][0],"phone":fields['phone'][0],"address":fields['address'][0],"email":fields['email'][0], "file_path":targetName,"dt":datetime,"status":"not verified"}
            db.collection('print', function(err, collection) {
                collection.insert(temp, {safe:true}, function(err, result) {
                    if (err) {
                        res.redirect("/add?msg=Something went wrong, try again!");
                    } else {
                      console.log(temp);
                        res.redirect("/home?msg=Your file is successfully added to printing queue!");
                      }
                });
            });
        }
      });
    });
  });
}

exports.getid = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving db by id: ' + id);
    db.collection('print', function(err, collection) {
        collection.find({'_id':new BSON.ObjectID(id)}).toArray(function(err, item) {
            res.send(item);
        });
    });
};

exports.getuser = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving db by mail: ' + id);
    db.collection('print', function(err, collection) {
        collection.find({'email':id}).toArray(function(err, item) {
            res.send(item);
        });
    });
};

exports.findall = function(req, res) {
    db.collection('print', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};