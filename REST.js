var mysql = require("mysql");
function REST_ROUTER(router,pool,md5) {
    var self = this;
    self.handleRoutes(router,pool,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,pool,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });
    
	router.post("/addUser",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user","email","password",req.body.email,md5(req.body.password)];
		console.log(req.body.email,md5(req.body.password));
        query = mysql.format(query,table);
		
		pool.getConnection(function(err, connection) {
			// Use the connection
			connection.query(query,function(err,rows){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
					console.log(err.code);
				} else {
					res.json({"Error" : false, "Message" : "User Added !"});
					//connection.release();
				}
			});
		});
    });
	
	 router.get("/users",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["user"];
        query = mysql.format(query,table);
        
		pool.getConnection(function(err, connection) {
			// Use the connection
			connection.query(query,function(err,rows){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
					console.log(err.code);
				} else {
					res.json({"Error" : false, "Message" : "Success", "Users" : rows});
					//connection.release();
				}
			});
		});
    });

    router.get("/users/:user_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user","id",req.params.user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
				connection.release();
            }
        });
    });
	
	router.put("/updateusers",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user","password",md5(req.body.password),"email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
            }
        });
    });
	
	router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user","email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });
	
	router.post("/addDevice",function(req,res){
        var query = "INSERT INTO ??(??) VALUES (?)";
        var table = ["device","devicename",req.body.devicename];
		console.log(req.body.devicename);
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				console.log(err.code);
            } else {
                res.json({"Error" : false, "Message" : "Device Added !"});
            }
        });
    });
		
	router.get("/devices/:device_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["device","id",req.params.device_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "devices" : rows});
            }
        });
    });	
		
	router.post("/postDeviceData",function(req,res){
        var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
        var table = ["devicemeasures","deviceid", "createtimestamp", "voltage","current", "power", "energy",
				req.body.deviceid, req.body.createtimestamp, req.body.voltage,
					 req.body.current, req.body.power, req.body.energy];
		console.log(req.body.deviceid);
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				console.log(err.code);
            } else {
                res.json({"Error" : false, "Message" : "Device Data Added !"});
            }
        }); 
    });
	
	router.get("/deviceData/:device_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["devicemeasures","deviceid",req.params.device_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "device measures" : rows});
            }
        });
    });
	
}

module.exports = REST_ROUTER;