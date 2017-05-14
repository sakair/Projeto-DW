(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    // Direcionar para pagina de cadastro ao clicar no botão...
    $(document).on("click", "btn_sidebar_cadastra_prova", function(evt)
    {
        $.ui.loadContent("#cadastrarProva",false,false,"slide");   
    });

        /* acao botao cadastro */
    $(document).on("click", "#btn_marcar", function(evt)
    {
        // dados prova
        var registro = {
                "DISCIPLINA": $("#disciplina").val(),
                "PROFESSOR": $("#professor").val(),
                "DATA": $("#data").val(),    
                "HORARIO": $("#horario").val(),       
            };
        
        // Cadastrar prova
        banco.insert("prova", registro, function(codigo){
            
            // Mensagem de sucesso!
            navigator.notification.alert("Prova #"+codigo+" marcada com sucesso!","INFORMAÇÃO",null,"OK");
            
            // Resetar formulário
            $("#disciplina").val("");
            $("#professor").val("");
            $("#data").val("");    
            $("#horario").val("");            
        });
    });
    
     /* listitem  #btnRelatorio */
     
     
    
     
    /**
    * EXEMPLO DE CHAMADA AO MÉTODO 'UPDATE' 
    banco.update("cliente",{"TELEFONE":"(41)98164-0655"},"CODIGO","1",function(status){
        alert(status);
    });
    **/

    /**
    * EXEMPLO DE CHAMADA AO MÉTODO 'DELETE' (excluindo o cadastro de CODIGO=2, na tabela cliente)...
    banco.delete("cliente","CODIGO","2",function(status){
        alert(status);
    });
    **/
    
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
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
