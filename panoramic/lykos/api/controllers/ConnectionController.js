/**
 * ConnectionController
 *
 * @description :: Server-side logic for managing connections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {

 	testConnection:function(req,res){

 		if(req.param('managers_id')==1) {
			var pg = require('pg');
			var conString = "postgres://"+req.param('user')+":"+req.param('password')+"@"+req.param('host')+"/"+req.param('database');
			pg.connect(conString, function(err, client, done) {
				if(err) {
					return res.json({"success":false, "message":'Ha ocurrido un error intentando establecer la conexión.'});
				}
				client.query('SELECT $1::int AS number', ['1'], function(err, result) {
				done();

				if(err) {
				  return res.json({"success":false, "message":'Ha ocurrido un error intentando ejecutar el query de prueba.'});
				}
				return res.json({success:true, "message":'Felicidades!. La conexión luce correcta.'});
				});
			});
		}
		if(req.param('managers_id')==2)  {
			var mysql = require('mysql');
			var connection = mysql.createConnection({host: req.param('host'),user: req.param('user'),password : req.param('password'),database : req.param('database')});
			connection.connect(function(err) {
			  if (err) {
			    return res.json({"success":false, "message":'Ha ocurrido un error intentando establecer la conexión.'});
			  }
			  return res.json({success:true, "message":'Felicidades!. La conexión luce correcta.'});
			});	
		}
	},

 	setConnection: function(req,res) {

 		Connection.find().populateAll().exec(function (err, values) {
 			var stringConnection= "";
 			var modelString= "";

 			fs = require('fs');

 			for (var i = 0; i < values.length; i++) {
 				if(i==values.length-1) {
 					stringConnection+=values[i].managers_id.name+"_"+values[i].alias+":{\nadapter: '"+values[i].managers_id.adapter+"',\nhost:'"+values[i].host+"',\nuser: '"+values[i].user+"',\npassword: '"+values[i].password+"',\ndatabase: '"+values[i].database+"'\n}";
 				}
 				if(i!=values.length-1) {
 					stringConnection+=values[i].managers_id.name+"_"+values[i].alias+":{\nadapter: '"+values[i].managers_id.adapter+"',\nhost:'"+values[i].host+"',\nuser: '"+values[i].user+"',\npassword: '"+values[i].password+"',\ndatabase: '"+values[i].database+"'\n},\n";
 				}
 				
 				if(values[i].is_system==false) { 					
 					var modelData="module.exports={\nconnection:'"+values[i].managers_id.name+"_"+values[i].alias+"',\nautoCreated:false,\nautoUpdated:false,attributes:{\n}\n};"
 					//var controllerData="module.exports={\ntestConnection:function(req,res){\n"+values[i].alias+".query(req.param('query'),function(err,values){\nif(err) return res.serverError(err);\nelse {\nif(values.fields.length>0){\nreturn res.json({success:true});\n}\nelse {\nreturn res.json({success:false});\n}\n}\n});\n}\n};";
 					fs.writeFile('api/models/'+values[i].alias+'.js', modelData, function (err) {
 						if (err) return console.log(err);
 					});
					/*var global_data = fs.readFileSync('api/controllers/report.js').toString();
					fs.writeFile('api/controllers/'+values[i].alias+'Controller.js', global_data, function (err) {
						if (err) return console.log(err);
					});*/				
 				}
 			};

 			var dataConnection="module.exports.connections={\n"+stringConnection+"\n};";
 			
 			fs.writeFile('config/connections.js', dataConnection, function (err) {
 				if (err) return console.log(err);
 			});		

 			return res.ok();

 		});

}

};

