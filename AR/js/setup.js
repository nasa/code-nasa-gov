//General function for unpausing the AR simulation. 
function resumeAR(){
    var videoFeed = document.getElementById("aScene");
    if (videoFeed.getAttribute("paused")!= null){
      videoFeed.play();
      videoFeed.removeAttribute("paused");
      document.getElementById("footerDiv").classList.remove("visible");
      document.getElementsByTagName("main")[0].classList.remove("visible");
    }
}
//Function for the Submenu screen button
function buttonToggle(){
  var videoFeed = document.getElementById("aScene");
  var dropdown = document.getElementsByClassName("dropdown")[0];
  //button toggles off
  if(videoFeed.getAttribute("paused") != null){
    resumeAR();
    dropdown.classList.remove("visible");
  }
  //button toggles on
  else{
    videoFeed.pause();
    videoFeed.setAttribute("paused", "");
    dropdown.classList.add("visible");
  }

}