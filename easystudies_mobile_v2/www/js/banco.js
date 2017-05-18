if (!window.indexedDB) {
    window.alert("Seu navegador não suporta a versão estável do indexedDB. Algumas features poderão não funcionar.");
} else {
    
// Criar banco de dados
    var request = indexedDB.open("projeto_dw", 1);
    var db = null;    
    request.onupgradeneeded = function() {
        db = request.result;
        
        var prova = db.createObjectStore("tbl_provas", {autoIncrement : true});
        
        prova.createIndex("ID_PROVA", "ID_PROVA", {unique : true});
        prova.createIndex("DISCIPLINA", "DISCIPLINA", {unique : false});
        prova.createIndex("PROFESSOR", "PROFESSOR", {unique : false});
        prova.createIndex("DATA", "DATA", {unique : false});
        prova.createIndex("HORARIO", "HORARIO", {unique : false});
        
        }
    request.onsucess = function() {
        db = request.result;
        console.log(db);
        console.log("Conectado");
    }
    request.onerror = function(event) {
        console.log("Erro ao conectar");
    }
}
