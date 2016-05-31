angular.module('starter.controllers', [])

.controller('RegisterCtrl', function($scope, $rootScope, $state, $stateParams, socket, users) {
    $rootScope.steps = 0
    $scope.submit = false

    // ,{"field":"Profile Picture","type":"file","value":" ","ref":"profilepic"}
    $scope.items = [{
        "field": "Name",
        "type": "text",
        "ref": "username"
    }, {
        "field": "Mobile",
        "type": "number",
        "ref": "mobileno"
    }]
    $rootScope.max = $scope.items.length - 1

    $scope.join = function() {
        //sanitize the nickname
        var user = {}
        for (i = 0; i < $scope.items.length; i++)
            if ($scope.items[i].value == undefined || $scope.items[i].value == "")
                $scope.submit = false
            else
                user[$scope.items[i].ref] = $scope.items[i].value

        if ($scope.submit) {
            // $state.go('tab.chats')
        }
        console.log(user)
        $scope.submit = false
        users.register(user)
            .success(function(response) {
                console.log(response);
            })
            .error(function(err) {
                console.log(err);
            });
        // socket.emit('add user', user);

        // $rootScope.spinner(true)
    }

    $scope.goStep = function(state) {
        console.log(state)
        console.log($rootScope.steps)
        if (state == "next" && $rootScope.steps >= $rootScope.max) {
            $scope.submit = true
            $scope.join()
        } else if (state == "next")
            $rootScope.steps = $rootScope.steps + 1
        else
            $rootScope.steps = $rootScope.steps - 1
    }
})


.controller('TabCtrl', function($scope, $rootScope, $ionicPopover, socket) {
    console.log("asd");
    $ionicPopover.fromTemplateUrl('templates/settings.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $rootScope.options = function() {
        console.log("options")
        $scope.popover.show(event);
    }

    $scope.setting = function(type) {
        console.log(type)
        $scope.popover.hide();
    };
})

.controller('LoginCtrl', function($scope, $rootScope, users) {

    $scope.user = {}

    $scope.login = function() {
        console.log($scope.user)
        $rootScope.spinner(true)
        users.login($scope.user)
            .success(function(response) {
                console.log(response);
                $rootScope.Store("user", response)
                $rootScope.spinner(false)
            })
            .error(function(err) {
                console.log(err);
                $rootScope.spinner(false)
            });
    }

})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $rootScope, $stateParams, Chats, socket) {
    // $scope.chat = Chats.get($stateParams.chatId);

    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 400;
    $rootScope.nickname = $stateParams.nickname



    //initializing local variables
    $scope.messages = []
    $scope.message = ""
    $scope.number_message

    $scope.sendMessage=function(){
      if($scope.message !== ""){
        socket.emit('new message', $scope.message)
        socket.emit('msg_user', $stateParams.chatId, $stateParams.tochatId, $scope.message);
        $scope.addMessageToList($stateParams.nickname,true,$scope.message,new Date(),true)
        socket.emit('stop typing');
        $scope.message = ""
      }
    }    

    $scope.message_string = function(number_of_users)
    {
        return number_of_users === 1 ? "There's 1 participant Online":"There are " + number_of_users + " participants Online"
    }

    // Display message by adding it to the message list
    $scope.addMessageToList = function(username,style_type,message,time,current){
        username = username
        $scope.removeChatTyping(username)
        var color =  null
        $scope.messages.push({content:message,style:style_type,username:username,color:color,date:time,current:current})
        // $ionicScrollDelegate.scrollBottom();
    }

    // Removes the visual chat typing message
     $scope.removeChatTyping =  function(username) {
        $scope.messages = $scope.messages.filter(function(element){return element.username != username || element.content != " is typing"})
    }

    socket.on('connect', function() {

        connected = true

        //Add user
        console.log($stateParams.chatId)
        if($stateParams.roomId == undefined)
            socket.emit('add user', $stateParams.chatId);
        else
            socket.emit('join room',{"chatid":$stateParams.chatId,"roomid":$stateParams.roomId});
        // On login display welcome message
        socket.on('login', function(data) {
            //Set the value of connected flag
            $scope.connected = true
            $scope.number_message= $scope.message_string(data.numUsers)

            console.log(data)
        });

        // Whenever the server emits 'new message', update the chat body
        socket.on('new message', function(data) {
            console.log(data)
                if(data.message&&data.username)
                {
                  $scope.addMessageToList(data.username,true,data.message,data.date,false)
                  // $scope.playSound('./sounds/chime');
                }
        });

        socket.on('msg_user_handle', function (username, data) {
            console.log(username +" "+ data)
        });
        
        // listener, whenever the server emits 'msg_user_found'
        socket.on('msg_user_found', function (username) {
            //alert(username);
            socket.emit('msg_user', username, my_username, prompt("Type your message:"));
        });

        // Whenever the server emits 'user joined', log it in the chat body
        socket.on('user joined', function(data) {
            // addMessageToList("",false,data.username + " joined")
            // addMessageToList("",false,message_string(data.numUsers)) 
            // $scope.number_message= message_string(data.numUsers)
            console.log(data.username)
            $scope.chat_message = data.username +" joined"
            console.log(data)
            $scope.number_message= $scope.message_string(data.numUsers)
        });

        // Whenever the server emits 'user left', log it in the chat body
        socket.on('user left', function(data) {
            // addMessageToList("",false,data.username+" left")
            // addMessageToList("",false,message_string(data.numUsers))
            // $scope.number_message = message_string(data.numUsers)
            $scope.chat_message = data.username+" left"
            $scope.number_message= $scope.message_string(data.numUsers)
            console.log(data)
        });

        //Whenever the server emits 'typing', show the typing message
        socket.on('typing', function(data) {
            // addChatTyping(data);
            // $scope.chat_message = data.username + " is typing"
            console.log(data)
        });

        // Whenever the server emits 'stop typing', kill the typing message
        socket.on('stop typing', function(data) {
            // removeChatTyping(data.username);
            // $scope.chat_message = " "
            console.log(data)
        });
    })

})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});