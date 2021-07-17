var system = document.getElementById("identifySystem").getAttribute("system");


document.getElementById("accountfile").id=system+"accountfile";
document.getElementById("videofile").id=system+"videofile";
document.getElementById("comment").id=system+"comment";
document.getElementById("timeFile").id=system+"timeFile";
document.getElementById("actionFile").id=system+"actionFile";

document.getElementsByClassName("systemName")[0].innerHTML=system;
document.getElementsByClassName("systemName")[0].id=system;

document.getElementById("stopSystem").innerHTML="DỪNG các máy hệ thống " + system;
document.getElementById("stopSystem").id=system+"stopSystem";

document.getElementById("runSystem").innerHTML="CHẠY các máy hệ thống " + system;
document.getElementById("runSystem").id=system+"runSystem";