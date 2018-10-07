
window.onload=function(){
    // Get the modal
    
var formIsOpened=false;
    
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var spann = document.getElementsByClassName("close")[1];
    
var modall = document.getElementById('myModalForm');

// Get the button that opens the modal
var btnn = document.getElementById("myBtnForm");
    var btnn1 = document.getElementById("myBtnForm1");
    var btnn2 = document.getElementById("myBtnForm2");
    var btnn3 = document.getElementById("myBtnForm3");
    var btnn4 = document.getElementById("myBtnForm4");
    var btnn5 = document.getElementById("myBtnForm5");
    var btnn6 = document.getElementById("myBtnForm6");
    var btnn7 = document.getElementById("myBtnForm7");
    var btnn8 = document.getElementById("myBtnForm8");



// When the user clicks on the button, open the modal 
btn.onclick = function() {
    if(!formIsOpened)
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
   
}

spann.onclick = function() {
    modall.style.display = "none";
   formIsOpened=false;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    
    
    if (event.target == modall) {
        modall.style.display = "none";
      formIsOpened=false;
    }
    
     if (event.target == modal) {
        modal.style.display = "none";
      
    }
    
}



btnn.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn1.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn2.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn3.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn4.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn5.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn6.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn7.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}
btnn8.onclick = function() {
    modall.style.display = "block";
    formIsOpened=true;
   
}

}
