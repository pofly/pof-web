var mongo = require('mongodb');
 var bson = require("bson");
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = bson.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('pof', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'user' (login.js) database");
        db.collection('user', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'user' (login.js) collection doesn't exist."+ err);
            } 
        });
    }
});

exports.check = function(req, res) {
    res.send("pof-backend is up! :)");
}

exports.login = function(req, res) {
    var id = req.params.id;
    var pass = req.params.pass;
    console.log('loging in id: ' + id );
    db.collection('user', function(err, collection) {
        collection.findOne({'mail': id},function(err, item) {
            if (item){
                if(item['pass'] ==  pass ){
                    res.send({"code":'0','name': item['name']});
                }
                else{
                    res.send({'code':'1','msg':'password incorrect'});
                }
            } else {
                res.send({'code':'2','msg':'no user for the credential'});
            }
        });
    });
};

exports.register = function(req, res) {
   var name = req.params.name;
   var mail = req.params.mail;
   var phone = req.params.phone;
   var pass = req.params.pass;

   var reg =  {'name':name,'mail':mail,'phone':phone,'pass':pass};

   db.collection('user', function(err, collection) {
        collection.findOne({'mail': mail},function(err, item) {
            if (item){
                res.send({"code":'1','msg': 'Email already exists'});
            }
            else if(err){
                res.send({"code":'2','msg': err});
            } 
            else {
                db.collection('user', function(err, collection) {
                    collection.insert(reg, {safe:true}, function(err, result) {
                        if (err) {
                            res.send({'code':'1','msg':err});
                        } else {
                            console.log('Adding to user: ' + JSON.stringify(reg));
                            res.send({"code":'0','name': name});
                        }
                    });
                });
            }
        });
    });




    
};