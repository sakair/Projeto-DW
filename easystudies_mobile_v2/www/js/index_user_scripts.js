(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 { 
/* button  #btn_footer_menu */
    $(document).on("click", "#btn_footer_menu", function(evt)
    {
         /*global uib_sb */
         /* Other possible functions are: 
           uib_sb.open_sidebar($sb)
           uib_sb.close_sidebar($sb)
           uib_sb.toggle_sidebar($sb)
            uib_sb.close_all_sidebars()
          See js/sidebar.js for the full sidebar API */
        
         uib_sb.toggle_sidebar($("#sidebar_lateral"));  
         return false;
    });
    
        /* button  #btn_footer_home */
    
    
        /* button  #btn_sidebar_provas_marcadas */
    $(document).on("click", "#btn_sidebar_provas_marcadas", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#provas"); 
         return false;
    });
    
        /* button  #btn_sidebar_cadastra_prova */
    
    
        /* button  #btn_sidebar_cadastra_prova */
    $(document).on("click", "#btn_sidebar_cadastra_prova", function(evt)
    {
         /*global activate_page */
         activate_page("#cadastrarProva"); 
         return false;
    });
    
        /* button  #btn_sidebar_fotos */
    $(document).on("click", "#btn_sidebar_fotos", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#fotos"); 
         return false;
    });
    
        /* button  #btn_sidebar_provas_marcadas */
    $(document).on("click", "#btn_sidebar_provas_marcadas", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#provas"); 
         return false;
    });
    
        /* button  #btn_voltar */
    $(document).on("click", "#btn_voltar", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#uib_page_2"); 
         return false;
    });
    
        /* button  #btn_sidebar_provas_marcadas */
    $(document).on("click", "#btn_sidebar_provas_marcadas", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#provas"); 
         return false;
    });
    
        /* button  #btn_footer_home */
    $(document).on("click", "#btn_footer_home", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#uib_page_2"); 
         return false;
    });
    $(document).on("click", "#btn_marcar", function(evt)
    {
         var disciplina = $("#disciplina").val(),
             professor = $("#professor").val(),
             data = $("#data").val(),
             horario = $("#horario").val(),  
             dado = [],
             transacao = db.transaction("tbl_provas", "readwrite"),
             store = transacao.objectStore("tbl_provas");
            
             dado.DISCIPLINA = disciplina;
             dado.PROFESSOR = professor;
             dado.DATA = data;
             dado.HORARIO = horario;
        
          var request = store.put(dado);
          
          request.onsucess = function(event) {
              console.log("Sucesso ao salvar");
          }
          request.onerror = function(event) {
              console.log("Erro ao conectar");
          }
          
          $("#disciplina").val("");
          $("#professor").val("");
          $("#data").val("");
          $("#horario").val("");
        
          alert("Prova de marcada");
        
          listaProva();
    });
         
}
 document.addEventListener("app.Ready", register_event_handlers, false);
})();

function listaProva() {
    $("#lista_prova").html("");
    var array = [];
    var objectStore = db.transaction("tbl_provas").objectStore("tbl_provas");
    objectStore.openCursor().onsucess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            array.push(cursor.value);
            cursor.continue();
        }
        else {
            var tamanho = array.length;
            console.log(array);
            for(var i = 0; i < tamanho; i++) {
                var item = '<a class="list-group-item allow-badge widget uib_w_20" data-uib="twitter%20bootstrap/list_item" data-ver="1"> <p class="list-group-item-text">'+array[i].DISCIPLINA+'</p></a>';
                $("#lista_prova").append(item);  
            }
        }
    };
}