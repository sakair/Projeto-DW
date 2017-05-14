window.banco =  {
    
    /* Variaveis do BD do sistema */
    DB_NAME: "BANCO_DW",
    DB_VERSION: "1.0",
    DB_DESCRIPTION: "Description of DB here...",
    DB_SIZE: 1*1024*1024,
    DB_TABLES: [
        {
            "table":"prova",
             "fields": [
                {"name":"ID", "type":"INTEGER", "size":11, "default":null, "key":true},
                {"name":"DISCIPLINA", "type":"VARCHAR", "size":60, "default":"", "key":false},
                {"name":"PROFESSOR", "type":"VARCHAR", "size":50, "default":"", "key":false},
                {"name":"DATA", "type":"VARCHAR", "size":20, "default":"", "key":false},
                {"name":"HORARIO", "type":"VARCHAR", "size":15, "default":"", "key":false}
            ]
        }
    ],
    
    /**  Funções de conexão ao banco de dados local **/
    initialize: function(){
        banco.connect(function() {
            intel.xdk.device.hideSplashScreen();
            setTimeout(function () {
                $.ui.launch();
                $.ui.backButtonText="Voltar";
            }, 50);
        });
    },
    connect: function(callback) {
        var self = this;
        // Instanciar banco de dados...
        this.db = window.openDatabase(self.DB_NAME, self.DB_VERSION, self.DB_DESCRIPTION, self.DB_SIZE);
        
        //self.resetDatabase(); // Resetar o banco de dados...

        // Carregar estrutura de tabelas...
        this.loadSchema(callback);
    },
    /**  FIM das funções de conexão ao banco de dados local **/
    
    /**  Funções de estrutura do banco de dados local **/
    loadSchema: function(callback) {
        var self = this;
        this.db.transaction(
            function(tx) {
                /**
                 * Estruturar tabelas no bd...
                 */
                $.each(self.DB_TABLES,function(i, t){
                    
                    var table = t["table"];
                    var sql = "CREATE TABLE IF NOT EXISTS "+table+" ( ";
                    
                    // Campos da tabela...
                    $.each(t["fields"], function(j, field){
                        
                        // Nome do campo...
                        var fName = field["name"];
                        
                        // Tipo do campo...
                        var fType = field["type"].toUpperCase();
                        
                        // Validar tamanho e chave (tipo inteiro)..
                        if(fType!="INTEGER" && fType!="FLOAT" && fType!="REAL" && fType!="NUMBER"){
                            fType += "("+field["size"]+")";
                        }
                        
                        // Validar chave...
                        if(fType=="INTEGER" && field["key"]==true){
                            var fKey = "PRIMARY KEY AUTOINCREMENT";
                        }else{
                            var fKey = "";
                        }
                        
                        // Validar valor padrao...
                        var fDefault = field["default"];
                        if(fDefault!=null){
                            if(fType!="INTEGER" && fType!="FLOAT" && fType!="REAL" && fType!="NUMBER"){
                                fDefault = "'"+fDefault+"'";
                            }
                            fDefault = "DEFAULT "+fDefault;
                        }else{
                            fDefault = "";
                        }
                        
                        // Montar SQL para criação do campo...
                        sql += fName+" "+fType;
                        if(fDefault.length>0) sql += " "+fDefault;
                        if(fKey.length>0) sql += " "+fKey;
                        
                        // Validar separador de campo...
                        if(j<t["fields"].length-1){
                            sql += ", ";
                        }
                        
                    });
                    
                    sql += " );";
                    // Montando a tabela... 
                    tx.executeSql(sql);
                    log(sql);
                });
                
            },
            function(tx){
                log('Error on update: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Tables successfully CREATED in local SQLite database');
                callback(true);
            }
        );
    },
    resetDatabase: function(callback) {
        var self = this;
        this.db.transaction(
            function(tx) {
                // Percorrer cada tabela...
                $.each(self.DB_TABLES,function(i, t){                    
                    var sql = 'DROP TABLE IF EXISTS '+t["table"];
                    tx.executeSql(sql);
                });
            },
            function(tx){
                log('Error on update: '+tx.message);
                //callback(false);                    
            },
            function() {
                log('Tables successfully DROPPED in local SQLite database');
                //callback(true);
            }
        );
    },
    emptyTable: function(table,callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql("DELETE FROM "+table);
				tx.executeSql("UPDATE sqlite_sequence SET seq=0 WHERE name='"+table+"'");
            },
            function(tx){
                log('Error on empty table: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Table '+table+' successfully EMPTED in local SQLite database');
                callback();
            }
        );
    },
    dropTable: function(table,callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS '+table);
            },
            function(tx){
                log('Error on drop table: '+tx.message);
                callback(false);                    
            },
            function() {
                log('Table '+table+' successfully DROPPED in local SQLite database');
                callback();
            }
        );
    },
    /**  FIM das funções de estrutura do banco de dados local **/
    
    /**  Funções de manipulação do banco de dados local **/        
    query: function(sql, callback) {
        this.db.transaction( function(tx) {
            tx.executeSql(sql, [], function (tx, result) {
                log('Query "'+sql+'" succeed!');
                callback(result);
            });
        });
    },
    selectAll: function(table, callback) {
        this.db.transaction( function(tx) {
            var sql = "SELECT * FROM "+table;
            tx.executeSql(sql, [], function (tx, results) {
                var len = results.rows.length;
                var registers = [];
                var i = 0;

                for (i = 0; i < len; i++) {
                    registers[i] = results.rows.item(i);
                }

                log(len + ' rows found');
                callback(registers);
            });
        });
    }, 
    insert: function(table, jsonRegister, callback){
	    var self = this;
        this.db.transaction(function(tx) {
            var columns = [];
            var values = [];
            var params = [];
            
            try{
              var fields = $.parseJSON(jsonRegister);
            }catch(err){
              var fields = jsonRegister;
            }

            // Percorrer valores do pacote JSON referente aos campos
            $.each(fields, function(key, value) {
                columns.push(key);
                values.push("?");
                params.push(String(value));
            });
            
            
            var sql = 'INSERT INTO '+table+' ('+columns+') VALUES ('+values+')';

            tx.executeSql(sql, params, function(tx, results) {
                var id = results.insertId;
                log('New record inserted in table "'+table+'". Key generated is '+id+'');
                callback(id);
            });
	    });
    },
    update: function(table, jsonFields, key, value, callback){
        var self = this;
        this.db.transaction(function(tx, results) {
                
            var values = "";
            var params = [];

            try{
              var fields = $.parseJSON(jsonFields);
            }catch(err){
              var fields = jsonFields;
            }

            // Percorrer valores do pacote JSON referente aos campos
            $.each(fields, function(k, v) {
                if (values=="") {
                    values = k+"=?";
                }else{
                    values = values + ", "+k+"=?";
                }
                params.push(String(v));
            });

            var sql = 'UPDATE '+table+' SET '+values+' WHERE '+key+' = '+value;
            tx.executeSql(sql,params, 
                function(tx, results) {
                
                    log('Update record '+key+' = '+value+' from table "'+table+'" | Params: '+JSON.stringify(params));
                    callback(true);
                
                },
                function(tx){
                    log('Error on update: '+tx.message);
                    callback(false);                    
                }
            );
            
        });
    },
    delete: function(table, key, value, callback){
        this.db.transaction(function(tx, results) {
            var sql = 'DELETE FROM '+table+' WHERE '+key+' = ?';
            tx.executeSql(sql,[value],
                function(tx, results) {
                    log("Removed record from table "+table+", where "+key+" = "+value);
                    callback(true);
                },
                function(tx){
                    log('Error on delete: '+tx.message);
                    callback(false);                    
                }
            );
	    });
    }, 
    /**  FIM das funções de manipulação do banco de dados local **/      
    
};

function log(msg) {
	console.log(msg);
}