//Async function that waits for the notebook to load completely before loading the AR /components
function checkforD3Load(){
  if (document.getElementsByTagName("video").length > 0){
    console.log("Load finishing...");
    setTimeout(loadAR, 100);
  }
  else{
    console.log("loading...");
    // Current wait time is one-tenth second
    setTimeout(checkforD3Load, 100);
  }
}

//Initial load of the AR visualization
function loadAR(){
  document.getElementById("arjsDebugUIContainer").style.display = "none";
  document.getElementById("dataD3").style.display = "none";
  document.getElementById("arjs-video").style.overflow = "hidden";
  //function definition at line 47
  reloadAR();
  var formArray = document.getElementsByTagName("form");
  var footDiv = document.getElementById("sliders");
  var origLength = formArray.length - 1;
  //This loop grabs the sliders from the notebook and puts them in the footer
  for(var x = 0; x < origLength; x++){
    var textRm = formArray[0].getElementsByTagName('div')[1];
    textRm.classList.add("textDesc");
    // I override the original descriptions due to them being really long
    if(x == 0){
      textRm.innerHTML = "Min.: 0 to 50 with steps by 5";
    }
    else{
      textRm.innerHTML = "Max.: 0 to 50 with steps by 5";
      formArray[0].getElementsByTagName('div')[0].classList.add("sliderBottom");
    }
    formArray[0].getElementsByTagName('div')[0].setAttribute("style", "float: left;");
    formArray[0].append(textRm);
    textRm.setAttribute("style", "padding-left: 11rem;");
    formArray[0].getElementsByTagName("input")[0].onchange = function(){reloadAR();};
    console.log(formArray[0]);
    footDiv.append(formArray[0]);
  }
  // This grabs the Cluster Visualization Selecter and the Link Box from the notebook
  formArray[0].getElementsByTagName("select")[0].setAttribute("onchange", "new function(){reloadAR();}");
  formArray[0].getElementsByTagName("div")[1].style.display = "none";
  document.getElementById("clusterList").append(formArray[0]);
  document.getElementsByTagName("section")[0].style.background = "white";
  document.getElementsByTagName("section")[0].style.padding = 0;
  document.getElementById("clusterLinks").append(document.getElementsByTagName("section")[0]);
}

function reloadAR(){
  var nodes = document.getElementsByTagName("g");
  var aScene = document.getElementById("aScene");
  //Clears the scene of previous renders if any
  while (aScene.firstChild) {
    aScene.removeChild(aScene.firstChild);
  }
  // for each circle on the D3, this converts the circle attributes into spheres and plots them along the surface of a hemisphere
  for (var x = 0; x < nodes.length; x++){
    var newNode = document.createElement("a-sphere");
    var nodeText = document.createElement("a-text");
    var newPos = d3.select(nodes[x]).attr("transform").substring(10).split(",");
    newPos[1] = (newPos[1].substring(0,newPos[1].length - 1));
    var newPosNum = [Number(newPos[0])/200 - 2.33, Number(newPos[1])/200 - 2.33];
    var newSize = d3.select(nodes[x].children[0]).attr("r")/200;
    newPosNum[2] = Math.sqrt(2.6*2.6 - newPosNum[0]*newPosNum[0] - newPosNum[1]*newPosNum[1]) - 1.3;
    newNode.object3D.position.set(newPosNum[0], newPosNum[2] ,newPosNum[1]);
    //Formatting the sphere title object
    nodeText.object3D.position.set(0, newSize + .05 ,0);
    nodeText.object3D.rotation.set(
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(270),
      THREE.Math.degToRad(0)
    );
    nodeText.setAttribute("value", nodes[x].innerHTML.split("<")[0].split(":")[1]);
    nodeText.setAttribute("position", nodeText.object3D.position);
    nodeText.setAttribute("rotation", {x: 270, y: 0, z: 0});
    nodeText.setAttribute("wrap-count", 200);
    nodeText.setAttribute("color", "black");
    nodeText.setAttribute("align", "center");
    //Formatting the sphere object
    newNode.setAttribute("position", newNode.object3D.position);
    newNode.setAttribute("radius", newSize);
    newNode.setAttribute("color", d3.select(nodes[x].children[0]).attr("fill"));
    newNode.setAttribute("colorBU", d3.select(nodes[x].children[0]).attr("fill"));
    // These attributes store the information for the pop up menu
    newNode.setAttribute("projects", d3.select(nodes[x]).datum().data.projects);
    newNode.setAttribute("name", d3.select(nodes[x]).datum().data.name.split(":")[1]);
    newNode.setAttribute("count", d3.select(nodes[x]).datum().data.value);
    // "Clickable" is so the raycaster can touch the sphere
    newNode.classList.add("clickable");
    //Function that pauses the AR and displays more information in the popup menu
    newNode.addEventListener('click', function (evt) {
      var videoFeed = document.getElementById("aScene");
      videoFeed.pause();
      videoFeed.setAttribute("paused", "");
      var tempAName = document.createElement("a");
      tempAName.setAttribute("href", "https://code.nasa.gov/?q=" + this.getAttribute("name"));
      tempAName.innerHTML = this.getAttribute("name");
      var tagName = document.getElementById("TagName");
      while (tagName.firstChild) {
        tagName.removeChild(tagName.firstChild);
      }
      tagName.append(tempAName);
      document.getElementById("Count").innerHTML = this.getAttribute("count");
      var projects = this.getAttribute("projects").split(',');
      var container = document.getElementById("Projects");
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      for(var x = 0; x < projects.length; x++){
        var tempA = document.createElement("a");
        if (x != projects.length - 1){
          tempA.innerHTML = projects[x] + ", <br>";
        }
        else{
          tempA.innerHTML = projects[x];
        }
        tempA.setAttribute("href", "https://code.nasa.gov/?q=" + projects[x].split('(')[0]);
        container.append(tempA);
      }
      document.getElementById("footerDiv").classList.add("visible");
      document.getElementsByClassName("mobileCH")[0].classList.add("visible");
      document.getElementsByTagName("main")[0].classList.add("visible");
      
    });
    // When hovering over a sphere, the object turns blue
    newNode.addEventListener('mouseenter', function (evt) {
      this.setAttribute("color", "lightblue");
    });
    newNode.addEventListener('mouseleave', function (evt) {
      this.setAttribute("color", this.getAttribute("colorBU"));
    });
    //Add to AR scene
    newNode.appendChild(nodeText);
    aScene.appendChild(newNode);
  }
}

//Sets the AR load into motion
setTimeout(checkforD3Load, 100);
