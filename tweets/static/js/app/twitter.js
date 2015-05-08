(function (angular) {
  // Creates a sweet angulur module
  angular.module('twitter', ['ui.router'])

  .constant('STATIC_URL', 'static/js/app/views/')

  .config(function ($interpolateProvider, $stateProvider, STATIC_URL, $locationProvider) {
    // Have to change the interpolate symbol because it's the same as djangos!
    $interpolateProvider.startSymbol('{+');
    $interpolateProvider.endSymbol('+}');

    $locationProvider.html5Mode(true); // no weird urls!!!

    $stateProvider.state('base', {
      url: '/',
      controller: "messagesCtrl",
      templateUrl: STATIC_URL + "messages.html"
    })
	.state('login', {
		controller: 'loginCtrl',
		templateUrl: STATIC_URL + 'login.html'
	})
    .state('my_messages', {
      url: '/my-messages',
      controller: 'myMessagesCtrl',
      templateUrl: STATIC_URL + "messages.html"
    })
    .state('users_messages', {
      url: '/messages/:username',
      controller: 'usersMessagesCtrl',
      templateUrl: STATIC_URL + "messages.html"
    })
    .state('hashtag_messages', {
      url: '/messages/hashtag/:hashtag',
      controller: 'hashtagMessagesCtrl',
      templateUrl: STATIC_URL + "messages.html"
    })
  })

   .run(function ($rootScope, user) {
      $rootScope.user = user.get; // attaches user.get to all non isolated scopes!
   })
  .directive('spinningMyLifeAway', function () {
    return {
      template: "<span class=\"spinner\"></span>",
    }
  })

  .directive('switchOutButtonOnSave', function () {
    return {
      restrict: 'E',
      template: "<input type=\"button\" value=\"{+ value+}\" ng-click=\"submitting()\"" +
                "ng-if=\"!saving\"/><spinning-my-life-away ng-if=\"saving\" spin=\"saving\">",
      scope: {
        'value': '@', // value is 1 way binding
        'save': '&twitterSave' // allows us to decouple
      },
      link: function (scope, element, attributes) {
        scope.submitting = submitting;

        function submitting () {
          scope.saving = true;
          var b = scope.save()
          b.finally(function () {scope.saving = false; });
        }
      }
    }
  })

  .directive('hashtagLinker', function ($compile) {
    return {
      restrict: 'E',
      template: '<div><h4><a ui-sref="users_messages({username: message.username})">{+ message.username +}</a></h4></div>' +  
                '<div>{+ message.created_at | date:"medium" +}</div>',
      transclude: true,
      scope: {
        message: "=",
      },
      link: function (scope, element, attrs) {
        var content;
        function createHashTagLinks (hashtag) {
          var word = hashtag.split('#')[1];
          return '<a ui-sref="hashtag_messages({hashtag: \'' + word + '\'})">' +
                   hashtag + '</a>';
        }

        function createUserTagLinks (username) {
         var user = username.split('@')[1];
          return '<a ui-sref="users_messages({username: \'' + user + '\'})">' +
                   username + '</a>';
        }

        var watch = scope.$watch('message', function (newVal, oldVal) {
          if (newVal) {
            var hashtags = scope.message.text.match(/#\w+/g),
                links = '',
                users = scope.message.text.match(/@\w+/g);

            if (hashtags) {
              links = hashtags.reduce(function (previous, hashtag) {
                return previous + " " + createHashTagLinks(hashtag)
              }, '')
            }

            if (users) {
              links += users.reduce(function (previous, username) {
                return previous + " " + createUserTagLinks(username);
              }, '');
            }
        
            var tweet = "<span>" + scope.message.text + "<div>" + links + "</div></span>"
            content = $compile(tweet)(scope);
            element.children()[0].appendChild(content[0]);
            watch();
          }
        });
      }
    }
  })

  .factory('login', function ($http) {
    return function login (username, password) {
      var creds = username + ":" + password;
      creds = window.btoa(creds);
      $http.defaults.headers.common.Authorization = "Basic " + creds;
    }
  })

  .factory('messages', function ($http, $q) {
    var messages = [],
        current_params = {};

    return {
      refreshList: asynchGetList,
      getDefaultList: getDefaultList,
      createMessage: createMessage,
      remove: remove
    }

    function asynchGetList (params) {
      current_params = params;
	  var defer = $q.defer();
      $http.get('api/messages/', {
        params: params
      }).success(function (response) {
        messages = response;
		defer.resolve();
      }).error(defer.reject);
	  return defer.promise;
    }

    // Hoisting will put this messages at the top
    // Just for organization
    function getDefaultList () {
      return messages;
    }

    function createMessage (message) {
      return $http.post('api/messages/', {text: message})
           .success(asynchGetList.bind(null, current_params));
    }

    function remove (message) {
      return $http.delete('api/messages/' + message.id + '/')
          .success(asynchGetList.bind());
    }
  })


  .factory('user', function () {
	 var username;
	 return {
       get : function () { return username; },
	   set : function (_) { username = _; }
	 }
  })
  
  // a controller for creating messages
  .controller('createMessageCtrl', function ($scope, messages) {
    // allows the use of the save method inside the template
    $scope.save = messages.createMessage;
  })

  // a controller for listing messages
  .controller('messagesCtrl', function ($scope, messages, login) {
    // forwarding the message functions
    messages.refreshList();
    $scope.messages = messages.getDefaultList;
    $scope.remove = messages.remove;
  })

  .controller('hashtagMessagesCtrl', function ($scope, messages, $stateParams) {
    messages.refreshList({hashtag: $stateParams.hashtag});
    $scope.messages = messages.getDefaultList;
    $scope.remove = messages.remove;
  })

  .controller('usersMessagesCtrl', function ($scope, messages, $stateParams) {
    messages.refreshList({username: $stateParams.username});
    $scope.messages = messages.getDefaultList;
    $scope.remove = messages.remove;
  })
  
  .controller('loginInfo', function ($scope, user) {
     $scope.username = user.get;
  })
  
  .controller('loginCtrl', function ($scope, login, messages, $state, user) {
	  $scope.login = logMeIn;
	  function logMeIn () {
	    login($scope.username, $scope.password);
		messages.refreshList()
		  .then(function () {
		    user.set($scope.username);
			$state.go('base');
			},
			function () {
	        $scope.errors = "These are not the droids you're looking for. Move along."
		  })
	  }
  })
})(angular)
