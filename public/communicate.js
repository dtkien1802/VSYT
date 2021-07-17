const systemName = document.getElementsByClassName("systemName")[0].innerHTML;

//stop system
function stopSystem(x) {
    socket.emit('stopSystem', x.substr(0, 5));
}

//run system
function runSystem(x) {
    socket.emit('runSystem', x.substr(0, 5));
}

//stop
function stop(idno) {
    socket.emit('stop', idno);
}
//update all
function update(idno) {
    var username = document.getElementById("username" + idno).value;
    var password = document.getElementById("password" + idno).value;
    var list = document.getElementById("list" + idno).value;
    var comment = document.getElementById("comment" + idno).value;
    var action = document.getElementById("option" + idno).value;
    var time = document.getElementById("time" + idno).value;

    document.getElementById("curusername" + idno).innerHTML = username;
    document.getElementById("curpassword" + idno).innerHTML = password;
    document.getElementById("curlist" + idno).innerHTML = list;
    document.getElementById("curcomment" + idno).innerHTML = comment;
    document.getElementById("curoption" + idno).innerHTML = action;
    document.getElementById("curtime" + idno).innerHTML = time;

    socket.emit('update', { username: username, password: password, ipaddr: idno, list: list, comment: comment, action: action, time: time });
}

//run clicked
function run(idno) {
    socket.emit('run', idno);
}

//comment input
function updateComment() {
    var comment = document.getElementById(systemName+"comment");
    socket.emit('updateComment', {value: comment.value, system: systemName});
}

//account input
document.getElementById(systemName+'accountfile').addEventListener('change', function () {
    var fr = new FileReader();
    fr.onload = function () {
        //Read file content
        var res = fr.result.split("\r\n");
        console.log(res);
        socket.emit('accountfile', {value: res, system: systemName});
    }
    fr.readAsText(this.files[0]);
});

//video input
document.getElementById(systemName+'videofile').addEventListener('change', function () {
    var fr = new FileReader();
    fr.onload = function () {
        //Read file content
        var res = fr.result.split("\r\n0000\r\n");
        console.log(res);
        socket.emit('videofile', {value: res, system: systemName});
    }
    fr.readAsText(this.files[0]);
})

//time input
document.getElementById(systemName+'timeFile').addEventListener('change', function () {
    var fr = new FileReader();
    fr.onload = function () {
        //Read file content
        var res = fr.result.split("\r\n");
        console.log(res);
        socket.emit('timeFile', {value: res, system: systemName});
    }
    fr.readAsText(this.files[0]);
})

//action input
document.getElementById(systemName+'actionFile').addEventListener('change', function () {
    var fr = new FileReader();
    fr.onload = function () {
        //Read file content
        var res = fr.result.split("\r\n");
        console.log(res);
        socket.emit('actionFile', {value: res, system: systemName});
    }
    fr.readAsText(this.files[0]);
})

//update status
socket.on("statusupdate", function (name, status) {
    document.getElementById("status" + name).innerHTML = status;
    console.log("mes: " + status + "     " + name);
})




