
window.onload = function() {
  
  document.body.style.opacity = "1";
  

  var bg = document.getElementById("bg-layer");
  if (bg != null) {
    bg.style.opacity = "1";
    bg.style.transform = "scale(1)";
  }
};


window.onpageshow = function(event) {
  document.body.style.opacity = "1";
  document.body.classList.remove("fade-out"); 
  
  var bg2 = document.getElementById("bg-layer");
  if (bg2 != null) {
    bg2.style.opacity = "1";
    bg2.style.transform = "scale(1)";
  }
};


var allLinks = document.getElementsByTagName("a");


for (var i = 0; i < allLinks.length; i++) {

  allLinks[i].onclick = function(event) {
    var linkHref = this.getAttribute("href");
    
  
    if (linkHref && linkHref.indexOf(".html") !== -1) {
      
      
      event.preventDefault(); 
      
     
      document.body.style.opacity = "0"; 
      
   
      var bg3 = document.getElementById("bg-layer");
      if (bg3 != null) {
        bg3.style.opacity = "0";
        bg3.style.transform = "scale(3.0)"; 
      }
      
     
      setTimeout(function() {
        window.location.href = linkHref;
      }, 450); 
    }
  };
}
