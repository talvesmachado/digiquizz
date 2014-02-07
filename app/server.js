var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer(function(req, res) {
	console.log('server created');
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);

var usersSockets = {};
var master = {};
var masterSocket = {};
var izQuizzing = false;

io.sockets.on('connection', function(socket) {
	var me = false;

	socket.on('loginMaster', function() {
		masterSocket = socket;
	});
	socket.on('loginPlayer', function(user) {
		me = user;
		me.id = md5.digest_s(user.username);

		usersSockets[me.id] = socket;
		console.log(socket);
		io.sockets.emit('newPlayer', me);
	});
	socket.on('startQuestion', function(obj) {

		io.sockets.emit('newQuestion', obj);

	});
	socket.on('stopQuestion', function(obj) {
		console.log('stopQuestion');
	});
	socket.on('sendAnswer', function(answerID) {
		// console.log(question.questionID);
		// console.log(question.userAnswer);
		var answerObj = new Object();
		answerObj.answerID = answerID;
		answerObj.user = me;
		io.sockets.emit('answerSended', answerObj)
	});
	socket.on('goodRequest', function(userID) {
		usersSockets[userID].emit('goodRequest');

	});
	socket.on('badRequest', function(userID) {
		usersSockets[userID].emit('badRequest');

	});
	socket.on('disconnect', function() {
		if (!me) return false;
		delete usersSockets[me.id];
		io.sockets.emit('disconnectedPlayer', me)
	});
});

/*io.sockets.on('connection', function(socket){
    var me = false;
    var colors = ['ff0084', '61d38e', '7563c0', '626953', 'cbed4e', '068838', '916d77', '4180a3'];

    //for(k in users){
    //    socket.emit('newUser', users[k]);
    //}
    if(!isQuizzing)
    {
        io.sockets.emit('newQuestion', {questionID:0});
    }

    socket.on('loginMaster', function(){
        socket.emit('masterLogged');
        masterSocket = socket;
    });

    socket.on('loginPlayer', function(user){
        me = user;
        me.id = md5(user.username);
        if(users[me.id]){
            socket.emit('usernameAlreadyExist')
            return false;
        }
        me.avatar = 'http://placehold.it/50/'+colors[Math.round(Math.random()*colors.length)];
        socket.emit('loggedPlayer');
        users[me.id] = me;
        io.sockets.emit('newPlayer', me);
    });

    socket.on('sendAnswer', function(question){
        console.log(question.questionID);
        console.log(question.userAnswer);
    });

    socket.on('disconnect', function(){
        if(!me)return false;
        delete users[me.id];
        io.sockets.emit('disconnectedPlayer', me)
        if(Object.keys(users).length == 0)masterSocket.emit('noPlayer');
    });
});*/