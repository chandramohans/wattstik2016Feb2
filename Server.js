var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');

var rest = require("./REST.js");

var app  = express();

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://eyvxyvsf:XD89pD6CLAa8@m10.cloudmqtt.com:19556');

var pool      =    mysql.createPool({
	connectionLimit : 100,
	waitForConnections : true,
	queueLimit :0,
	host     : 'us-cdbr-iron-east-03.cleardb.net',
	user     : 'b66276f8f3ed9f',
	password : 'e3d4f6b4',
	database : 'heroku_2f2b3584c2e81bb',
	debug    :  true,
	wait_timeout : 28800,
	connect_timeout :10
});

function REST(pool){
    var self = this;
    self.connectMysql(pool);
};

REST.prototype.connectMysql = function(pool) {
    var self = this;
 
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
            console.log('connected to db');
		  //connection.release();
        }
    });
	
	self.configureExpress(pool);
}

REST.prototype.configureExpress = function(pool) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,pool,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(process.env.PORT || 5000,function(){
          console.log("All right ! I am alive at Port 5000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST(pool);

client.subscribe('devices/data', function() {
	client.on('message', function(topic, message, packet) {
	console.log("received '" + message + "' on '" + topic + "'");
	// do something with message, for eg.: emit via WebSocket to the connected clients
	var json = JSON.parse(packet.payload);
	storeDeviceData(json);
	});
});

function storeDeviceData(json){
/*	for (var k in json) {
			var v = json[k];
			console.log('Key: %s, Value: %s', k, v);
		}
*/
//	Object.keys(json)[0]) //deviceid, gatewaydeviceid,createtimestamp, voltage, current, power, energy;
	console.log(json.deviceid);
	
	var query = "INSERT INTO ??(??,??,??,??,??,??,??) VALUES (?,?,str_to_date(?,\'%d:%m:%Y %H:%i:%s\' ),?,?,?,?)";
    var table = ["devicemeasures","deviceid", "gatewaydeviceid", "createtimestamp", "voltage","current", "power", "energy",
				json.deviceid, json.gatewaydeviceid, json.createtimestamp, json.voltage,
					 json.current, json.power, json.energy];
		
    query = mysql.format(query,table);
	pool.getConnection(function(err, connection) {
	// Use the connection
		connection.query(query,function(err,rows){
			if(err) {
				//res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				console.log(err.code);
			} else {
				//res.json({"Error" : false, "Message" : "Device Data Added !"});
				console.log("success");
				connection.release();
			}
		}); 
	});
}