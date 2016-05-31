// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','btford.socket-io','angularMoment'])

.run(function($rootScope, $location, $ionicPlatform, $ionicPopover, $ionicLoading) {

  $rootScope.steps = 0;
  $rootScope.url = 'https://ionic-chat-application.herokuapp.com';
  $rootScope.url = 'http://172.30.253.210:3000';

  /**
   * This function helps to Store the data in the key, value pairs
   * 
   * @param key
   * @param item
   */
  $rootScope.Store = function(key, item) {
    localStorage[key] = item;
  }

  
  /**
   * This function helps to Remove the data for the key
   * 
   * @param key
   */
  $rootScope.Remove = function(key) {
    localStorage.removeItem(key)
  }

  /**
   * This function helps to Retrieve the data for the key
   * 
   * @param key
   */
  $rootScope.Retrieve = function(key) {
    if (!localStorage.hasOwnProperty(key))
      return null;
    else
      return localStorage[key];
  }

  /**
   * This function helps to Clear the localStorage
   */
  $rootScope.Clear = function() {
    localStorage.clear()
  }


  /**
   * This function helps to display the spinner
   * 
   * @param action
   */
  $rootScope.spinner = function(action){
    if(action){
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      });
    }else{
      $ionicLoading.hide();
    }
  }

  /**
   * This function helps to go redirect to the view
   * 
   * @param path
   * @param back : true/false to disable the back button
   */
  $rootScope.redirect = function(path){
    //$rootScope.spinner(true);
    $location.path(path)
  }


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.chat-room', {
      url: '/chats/:chatId/:tochatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
