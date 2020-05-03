/*
Text over image
*/

var textOverImages = document.getElementsByClassName("TextOverImage");
var state;
for (var i = 0; i < textOverImages.length; i++) {
  textOverImages[i].onclick = textImages;
}
function textImages() {
  var classes = this.classList;
  if (classes.contains("show")) {
    classes.remove("show");
  } else {
    if (state != null) state.classList.remove("show");
    state = this;
    classes.add("show");
  }
}

/* Local storage */

var myLocalData = localStorage.getItem("toDoList");
if (myLocalData) {
  //alert(myLocalData);
  var mybody = document.getElementById("mylist");
  var res = myLocalData.split(",");
  var eleOl = document.createElement("ol");
  for (var i in res) {
    var eleLi = document.createElement("li");
    var eledata = document.createTextNode(res[i]);
    eleLi.appendChild(eledata);
    eleOl.appendChild(eleLi);
  }
  var eleH2 = document.createElement("h2");
  var h2data = document.createTextNode("List of Saved Tasks");
  eleH2.appendChild(h2data);
  mybody.appendChild(eleH2);
  mybody.appendChild(eleOl);
}
window.addEventListener("load", function() {
  document
    .getElementById("toDoListForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();

      var task = document.forms["toDoListForm"]["task"].value;

      if (task) {
        var data = "";

        data = task;

        if (myLocalData) {
          localStorage.setItem("toDoList", myLocalData + " , " + data);
        } else {
          localStorage.setItem("toDoList", data);
        }
        window.location.reload(true);
      } else {
        alert("Enter valid data");
      }

      console.log("Form Submitted");
    });
});
