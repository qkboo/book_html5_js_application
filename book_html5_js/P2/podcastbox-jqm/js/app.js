$(document).ready(function(){
    
    // so our #navigation-drawer will cover up to the page foot
    $('#main-contents').height($(document).height());
    
    // show the navigation drawer
    $('#show-drawer').click(function(){

        $('#text-content').fadeTo('slow', 0.33 );
        $('#menu-drawer').show('slide', { direction: 'left' }, 300);
        
        $(this).hide();
        $('#hide-drawer').show();
            
    });
    
    // hide the navigation drawer
    $('#hide-drawer').click(function(){

        $('#text-content').fadeTo('slow', 1 );
        $('#menu-drawer').hide('slide', { direction: 'left' }, 300);
        
        $(this).hide();
        $('#show-drawer').show();
            
    });
    
    
    // Tabhold , longpressed
    $( ".listitem" ).bind( "taphold", tapholdHandler );
 
    function tapholdHandler( event ){
      $( "#confirm" ).popup( "open" );
    }
});
