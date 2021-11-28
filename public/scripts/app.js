/*
Name: Peyman Moshfegh
ID: 301151808
Date: 10/29/2021
*/

// IIFE -- Imediately Invoked Function Expression

(function(){
    
    function Start(){
        console.log("App Started...");

        let deleteButtons = document.querySelectorAll('.btn-danger');

        for(button of deleteButtons) {
            button.addEventListener('click', (event) => {
                if (!confirm("Are you sure?")){
                    event.preventDefault();
                    //window.location.assign('/survey-list');
                }
            });
        }
        
    }

    window.addEventListener("load", Start);

})();