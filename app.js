const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set('view engine', 'ejs');

const computers = [];

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/maintenance', (req, res) => {
  res.render('maintenance');
});
app.get('/page1', (req, res) => {
  res.render('page1');
});
app.get('/page2', (req, res) => {
  res.render('page2');
});
app.get('/page3', (req, res) => {
  res.render('page3');
});
app.get('/page4', (req, res) => {
  res.render('page4');
});
app.get('/page5', (req, res) => {
  res.render('page5');
});
app.get('/page6', (req, res) => {
  res.render('page6');
});
app.get('/page7', (req, res) => {
  res.render('page7');
});
app.get('/page8', (req, res) => {
  res.render('page8');
});
app.get('/page9', (req, res) => {
  res.render('page9');
});
app.get('/page10', (req, res) => {
  res.render('page10');
});

//when a new connection
io.on('connection', (socket) => {
  //Emit all list
  //io.emit('computer', computers);
  socket.on("name", function(x) {
    console.log("computer: "+x);
  
  var clientIp = socket.request.connection.remoteAddress.substring(7);
  let exist = false;

  //check if computer exist in list, if already, just change status to "connected"
  for(let i=0; i<computers.length; i++) {
    if(computers[i][0] == x) {
      exist = true;
      computers[i][7] = "connected";
      if(computers[i][3]["search"]!="none"){
        io.emit('runcommand', computers[i]);
      }
      break;
    }
  }

  //if not exist, create new
  if(exist == false){
    //[ip, username, password, videolist[], comment[], time[], option[], status]
    const computer = [x, "none", "none", [{
      "search": "none",
      "title": "none",
      "watch": "none"
    }], ["none"], [5, 10, 15], [false, false, false, false, false], "connected"];
    computers.push(computer);  
    }
  
  //disconnect
  socket.on('disconnect', () => {
    //console.log(clientIp + ' disconnected');
    //io.emit('computerdis', clientIp);
    let i = 0;
    for(i=0; i<computers.length; i++) {
      if(x == computers[i][0]) {
        computers[i][7] = computers[i][7] + "\n" +"disconnected";
        break;
      }
    }
    console.log(computers[i]);
  });

  });

  //debugging
  console.log("ok: " + computers.length);
  //console.log(computers[computers.length-1]);

  // stop
  socket.on('stop', function (idno) {
    io.emit('stopnow', idno);
    console.log("Tat maoooo" + idno);
  })

  //update status
  socket.on('status', function (name, status) {
    console.log(status);
    let i=0;
    for(i=0; i<computers.length; i++) {
      if(computers[i][0] == name) {
        if(status=="CB"){
          computers[i][7] = computers[i][7]+"\n"+"connected";
          break;
        }
        computers[i][7] = status;
        //console.log(status+"      "+name);
        break;
      }
    }
    //console.log(status+"      "+name);
    io.emit('statusupdate', name, computers[i][7]);
  })


  //update all
  socket.on('update', function (data) {
    let i = 0;
    for(i=0; i<computers.length; i++) {
      if(computers[i][0] == data.ipaddr) {
        if(data.username!='')
          computers[i][1] = data.username;
        if(data.password!='')
          computers[i][2] = data.password;
        if(data.list!='') {
          var list = data.list.split("\n");
          var arr = [];
          for(let i = 0; i<list.length; i++) {
            var pair = list[i].split(";");
            var obj = {
              "search": pair[0],
              "title": pair[1],
              "watch": pair[2]
            }
            arr.push(obj);
          }
          //console.log("Hello" + arr);
          computers[i][3] = arr;
        }
          //computers[i][3] = data.list;
        if(data.comment!='') {
          //var arr = [];
          var arr = data.comment.split("\n");
          computers[i][4] = arr;
          console.log("hello: " + arr.length)
        }
        if(data.time!='') {
          var arr = data.time.split("-");
          computers[i][5] = arr;
        }
        if(data.action!='') {
          var arr = data.action.split("-");
          for(let j = 0; j<arr.length; j++) {
            if(arr[j]=='0')
              arr[j] = false;
            else
              arr[j] = true;
          } 
          computers[i][6] = arr;
        }
        break;
      }
    }
    //debugging
    console.log(computers[i]);
    //io.emit('computer', computers);
  });

  //comment input
  socket.on('updateComment', function(data) {
    var arr = data.split("\n");
    for(i=0; i<computers.length; i++) {
        computers[i][4] = arr;
    }
  });

  //runcommand send to individual
  socket.on('run', function(ipaddr) {
    for(let i=0; i<computers.length; i++) {
      if(ipaddr == computers[i][0]){
        io.emit('runcommand', computers[i]);
        console.log("Hello"+computers[i]);
        break;
      }
    }
    //debugging
    console.log("command");
  });

  //username-password input
  socket.on('accountfile', function(res) {
    let n = computers.length;
    if(res.length<computers.length)
      n = res.length;
    for(let i=0; i<n; i++) {
      var pair = res[i].split("|");
      computers[i][1] = pair[0];
      computers[i][2] = pair[1];
    }
  });

  //keyword-videotitle-% input
  socket.on('videofile', function(res) {
    let n = computers.length;
    if(res.length<computers.length)
      n = res.length;
    /// loop through each computer
    for(let i=0; i<n; i++) {
      var list = res[i].split("\r\n");
      var array = [];
      console.log(list);
      // loop through each line
      for(let j=0; j<list.length; j++){
        var pair = list[j].split(";");

          var obj = {
            "search": pair[0],
            "title": pair[1],
            "watch": pair[2]
          }
          array.push(obj);
        //console.log(obj);
      }
      //console.dir("Hello" + array);
      computers[i][3] = array;
    }
  });

  //time input
  socket.on('timeFile', function(res) {
    let n = computers.length;
    if(res.length<computers.length)
      n = res.length;
    for(let i=0; i<n; i++) {
      var pair = res[i].split("-");
      computers[i][5] = pair;
    }
  });

  //action input
  socket.on('actionFile', function(res) {
    let n = computers.length;
    if(res.length<computers.length)
      n = res.length;
    for(let i=0; i<n; i++) {
      var arr = res[i].split("-");
      for(let j=0; j<arr.length; j++) {
        if(arr[j]=='0')
          arr[j]=false;
        else
          arr[j]=true;
        //console.log(arr);
      }
      computers[i][6] = arr;
    }
  });

  socket.on('maintenance', function() {
    //console.log("maintenance");
    io.emit("maintenanceStart");
  });

  socket.on('updateClient', function() {
    //console.log("updateClient");
    io.emit("updateClientStart");
  });

  socket.emit('computer', computers);

});

//  process.env.PORT || 3000
server.listen(80, () => {
  console.log('listening on *:80');
});