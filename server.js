// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
var bodyParser= require('body-parser');
var googleStocks= require('google-stocks');
var googleFinance= require('google-finance');
var requested = require('request');
var lineChart = require('./line-chart.js');
var MongoClient= require('mongodb');
var reload= require('reload');
var server= require('http').createServer();
var http= require('http').Server(app);
var io= require('socket.io')(http);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//console.log(lineChart)
MongoClient.connect(process.env.DB, function(err,db){
// http://expressjs.com/en/starter/basic-routing.html
    var data=[]; var m=[];

var location=require('location-href');
  

io.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);

    //m.push('m')
  });
   //console.log('p')
  //socket.emit('testerEvent', { description: 'Oury custom event named testerEvent!'});
  
  
});
  
app.get('/index2', function(req,res){
res.render(__dirname + '/views/index2.html')

})  
  
  
app.get('/n', function(req,res){
  io.on('connect', function (socket) {
  socket.on('my other event', function (data) {
    //socket.disconnect('testerEvent', function(){});
  });
   //console.log('p')
  //socket.on('testerEvent', function(data){  
  io.emit('testerEvent', { description: 'Our custom event named testerEvent!'});
  //res.redirect('/')
  //})
});
//console.log('redirected');
  res.redirect('/')
});

  
app.get('/', function(req, res) {
  
  if(req.query.t){
   res.redirect('/n')
  }
  else{
  db.collection('stock').find({}).toArray(function(err,docs){ 
/*request('', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/
    var sto="NMSFT"; var vam=""; var date1=""; var date2="";
  if(req.query.me){var sto= req.query.me; var vam= req.query.me;}
    var interval="TIME_SERIES_WEEKLY"; var subI= "Weekly Time Series";
  if(req.query.interval){
  var interval= req.query.interval;
    if(interval=="TIME_SERIES_YEARLY"){subI = "Yearly Time Series"}
    if(interval=="TIME_SERIES_MONTHLY"){subI = "Monthly Time Series"}
    if(interval=="TIME_SERIES_WEEKLY"){subI = "Weekly Time Series"}  
    if(interval=="TIME_SERIES_DAILY"){subI = "Daily Time Series"}  
  }
  
    
requested('https://www.alphavantage.co/query?function='+interval+'&symbol='+sto+'&apikey='+process.env.API_KEY, function (error, response, body) {
  //console.log('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  if((JSON.parse(body))['Error Message']){
    db.collection('stock').find({}).toArray(function(err,docs){ 
var mD={my:docs}      
    res.render(__dirname + '/views/index.html', {value:"", data: [], doc:mD, date1:"", date2:""});
    })
  }
  else{
    var arr=[]; var m="";
    var dates=""; var q="";
 if(body==null || body== undefined || typeof(JSON.parse(body)) !== 'object' 
    || typeof(JSON.parse(body)[subI]) !== 'object' || JSON.parse(body)[subI] == null
   || JSON.parse(body)[subI] == undefined){var dates=[]}
 else{var dates= Object.keys(JSON.parse(body)[subI]);}
    for(var i=0; i<dates.length; i++){
      m=dates[i]; var d=[];
      
      if(req.query.me && !req.query.range){
       date2=dates[0];
       date1=dates[dates.length-1];
      }
      
      if(req.query.range){
       date2=dates[0];
       if(req.query.range=='1m'){
        date2=dates[0];
        var dated=new Date();
        dated.setMonth(dated.getMonth() - 1); 
    //  console.log(dated)
    // console.log(new Date(dates[i])< dated)
         if(new Date(dates[i])>dated){ 
           //console.log(dates[i])

          date1=dates[i]; q=1;
         }
         else{
           dates[i]="";
         }
       }
        
       if(req.query.range=='3m'){
        date2=dates[0];
        var dated=new Date();
        dated.setMonth(dated.getMonth() - 3); 
    //  console.log(dated)
    // console.log(new Date(dates[i])< dated)
         if(new Date(dates[i])>dated){ 
           //console.log(dates[i])

          date1=dates[i]; q=1;
         }
         else{
           dates[i]="";
         }
       }        
        
       if(req.query.range=='6m'){
        date2=dates[0];
        var dated=new Date();
        dated.setMonth(dated.getMonth() - 6); 
    //  console.log(dated)
    // console.log(new Date(dates[i])< dated)
         if(new Date(dates[i])>dated){ 
           //console.log(dates[i])

          date1=dates[i]; q=1;
         }
         else{
           dates[i]="";
         }
       }        
                
       if(req.query.range=='ytd'){
        date2=dates[0];
        var dated=new Date();
        dated.setMonth(0);
        dated.setDate(1); 
         
    //  console.log(dated)
    // console.log(new Date(dates[i])< dated)
         if(new Date(dates[i])>dated){ 
           //console.log(dates[i])

          date1=dates[i]; q=1;
         }
         else{
           dates[i]="";
         }
       }                
        
      if(req.query.range=='1y'){
        date2=dates[0];
        var dated=new Date();
        dated.setMonth(dated.getMonth() - 12); 
    //  console.log(dated)
    // console.log(new Date(dates[i])< dated)
         if(new Date(dates[i])>dated){ 
           //console.log(dates[i])

          date1=dates[i]; q=1;
         }
        else{
           dates[i]="";
         }
       }                
         
      if(req.query.range=='all'){
       date2=dates[0];
       date1=dates[dates.length-1];
       }                
        
      }      
//console.log(date1)
      
      dates.filter(x=>x!="");
      
      
      d.push(dates[i]); d.push(JSON.parse(body)[subI][m]["4. close"]);
      arr.push(d);
     // arr.push([dates[i], JSON.parse(body)["Monthly Time Series"][m]["4. close"] ])
    }
    //console.log(JSON.parse(body)["Monthly Time Series"][m]["4. close"])
   // res.send(JSON.parse(body)["Monthly Time Series"])
      //res.send(JSON.parse(body)["Monthly Time Series"].dates[1]["4. close"] );
    var mArr={answer:arr, val: req.query.me};
   // console.log(mArr)
    db.collection('stock').find({}).toArray(function(err,docs){ 
var mD={my:docs}    
      res.render(__dirname + '/views/index.html', {value:vam, data: mArr, doc:mD, date1:date1, date2:date2});
    })  
  }
});
    //console.log(arr)
/*  var info=[["2019-01-31",90],["2019-02-10",170],["2019-02-25",300],["2019-03-4",250],["2019-03-13",150],["2019-03-25",250]];
 var mArr={answer:info};
  res.render(__dirname + '/views/index.html', {value:true, data: mArr});*/

});
  }
})
  
  
app.post('/', function(req, res) {
  //console.log(req.body.stock)
  db.collection('stock').find({name: req.body.stock}).toArray(function(err,docs){ 

requested('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol='+req.body.stock+'&apikey='+process.env.API_KEY, function (error, response, body) {
  if((JSON.parse(body))['Error Message']){
    console.log('error');
    res.render(__dirname + '/views/index.html', {value:'', data: []});

  }
  else{
    var arr=[]; var m="";
 // console.log(docs)
   if(docs.length<1){
    db.collection('stock').insertOne({name: req.body.stock}, function(err,docs){
    
    })
   }
  //console.log(response)
   var dates=""; var q="";
 if(body==null || body== undefined || typeof(JSON.parse(body)) !== 'object' 
    || typeof(JSON.parse(body)["Monthly Time Series"]) !== 'object' || JSON.parse(body)["Monthly Time Series"] == null
   || JSON.parse(body)["Monthly Time Series"] == undefined){var dates=[]}
 else{var dates= Object.keys(JSON.parse(body)["Monthly Time Series"]);}
    
    for(var i=0; i<dates.length; i++){
      m=dates[i]; var d=[];
      d.push(dates[i]); d.push(JSON.parse(body)["Monthly Time Series"][m]["4. close"]);
      arr.push(d);
     // arr.push([dates[i], JSON.parse(body)["Monthly Time Series"][m]["4. close"] ])
    }    
    
  var mArr={answer:arr,val:req.body.stock};
    
  db.collection('stock').find({}).toArray(function(err,docs){ 
var mD={my:docs};
    

    res.redirect('/?t=yes&me='+req.body.stock);
  })



  }
});
  
 
})

})
  

  
app.get('/delete', function(req, res) {
  console.log(req.query.me);
  
    db.collection('stock').remove({name: req.query.me}, function(err,docs){
    
    })  
  
  res.redirect('/')
})  
  
 
  
        })
  
// listen for requests :)
const listener = http.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
