// bring in the express library
var express = require('express');
var app = express();

var http = require('http').createServer(app);

var port = process.env.PORT || 3000; //set the port if it's not set for us

var server = app.listen(port);

var ejs = require('ejs');

var Twit = require('twit');

var io = require('socket.io').listen(server);

var TwitterAPI = new Twit({
  consumer_key: 'O9AairbR9YK4qRQd5sludnfHH',
  consumer_secret: '6dlzpCWUFO25fvPLKVRmsYHmUJoaDIRBe9WvkLfqZfyP3iEwEu',
  access_token: '968534853862993920-6uI8KLYSktqn6UsSQvZQWWmhxuRWwqa',
  access_token_secret: 'LNgRVE7PSBI6OsCm2nFuY2HYVrdebeXqwxbP4ESe6nBnF'
});

console.log('fuck yeah! our server is running on port: ' + port);

var tweetStream = TwitterAPI.stream('statuses/filter', {
  track: 'hawaii'
});

tweetStream.on('tweet', function(tweetInfo){
  //do something upon a tweet event
  console.log(tweetInfo.text);
  io.sockets.emit('note', tweetInfo.text, tweetInfo.user.screen_name, tweetInfo.user.followers_count);
});

app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express); //tells node that we made our own html file
app.set('view-engine', 'html');

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, resolve){
  resolve.render('index.html');
});
