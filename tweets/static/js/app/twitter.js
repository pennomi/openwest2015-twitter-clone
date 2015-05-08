(function (angular) {
  // Creates a sweet angulur module with no dependencies
  angular.module('twitter', ['ui.router'])

  .constant('STATIC_URL', 'static/js/app/views/')
  // factories are singletons! So the same instance will shared across
  // all our controllers!
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
      template: "<div><h4>{+ message.user +}</h4></div>",
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

  .factory('user', function () {
    var username;
  })

  .factory('login', function ($http) {
    return function login (username, password) {
      var creds = 'a' + ":" + 'a';
      console.log(creds);
      creds = window.btoa(creds);
      $http.defaults.headers.common.Authorization = "Basic " + creds;
    }
  })

  .factory('messages', function ($http) {
    var messages = [],
        idCounter = 0,
        current_params = {};

    return {
      refreshList: asynchGetList,
      getDefaultList: getDefaultList,
      createMessage: createMessage,
      remove: remove
    }

    function asynchGetList (params) {
      current_params = params;
      $http.get('api/messages/', {
        params: params
      }).success(function (response) {
        messages = response;
      });
    }

    // Hoisting will put this messages at the top
    // Just for organization
    function getDefaultList () {
      return messages;
    }

    function geMyMessageList () {
      
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


  // a controller for creating messages
  .controller('createMessageCtrl', function ($scope, messages) {
    // allows the use of the save method inside the template
    $scope.save = messages.createMessage;
  })

  // a controller for listing messages
  .controller('messagesCtrl', function ($scope, messages, login) {
    // forwarding the message functions
    login()
    messages.refreshList()
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
})(angular)
