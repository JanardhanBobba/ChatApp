angular.module('starter.services', [])


.factory('socket',function($rootScope,socketFactory){
  //Create socket and connect to http://chat.socket.io 
  var myIoSocket = io.connect($rootScope.url);
  // var myIoSocket = io.connect('https://ionic-chat-application.herokuapp.com');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });
    
  return mySocket;
})


.factory('users',function($http,$rootScope){
  //Create socket and connect to http://chat.socket.io 
  var services = {};
  services.register = register;
  services.login = login;
  services.getUsersList = getUsersList;

  function register(data){
    return $http.post($rootScope.url+"/user",data,[])      
  }

  function login(user){
    console.log(user)
    data={
      "user":user
    }
    return $http.post($rootScope.url+"/login",data,[])      
  }

  function getUsersList(){
    return $http.get($rootScope.url+"/chat/list")
  }

  return services;
})



.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
