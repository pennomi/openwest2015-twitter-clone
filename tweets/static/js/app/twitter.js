(function (angular) {
  // Creates a sweet angulur module with no dependencies
  angular.module('twitter', ['ui.router'])

  .constant('STATIC_URL', 'static/js/app/views/')
  // factories are singletons! So the same instance will shared across
  // all our controllers!
  .config(function ($interpolateProvider, $stateProvider, STATIC_URL) {
    // Have to change the interpolate symbol because it's the same as djangos!
    $interpolateProvider.startSymbol('{+');
    $interpolateProvider.endSymbol('+}');

    $stateProvider.state('base', {
      url: '',
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
      template: "<div></div>",
      transclude: true,
      scope: {
        message: "="
      },
      link: function (scope, element, attrs) {
        var content;
        var watch = scope.$watch('message', function (newVal, oldVal) {
          if (newVal) {
            content = $compile("<span>" + scope.message + "</span>")(scope);
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
      var creds = username + ":" + password;
      creds = atob(creds);
      $http.defaults.headers.common.Authorization = "Basic " + creds;
    }
  })

  .factory('messages', function ($http) {
    var messages = [],
        idCounter = 0;
    createMessage('howdy');
    createMessage('Monkies');

    return {
      getList: getList,
      createMessage: createMessage,
      remove: remove
    }

    // Hoisting will put this messages at the top
    // Just for organization
    function getList (username) {
      return $http.get('api/messages').success(function (response) {
        messages = response;
      })
    }

    function createMessage (message) {
    }

    function remove (message) {

    }
  })


  // a controller for creating messages
  .controller('createMessageCtrl', function ($scope, messages, $timeout, $q) {
    // allows the use of the save method inside the template
    $scope.save = messages.createMessage;
  })

  // a controller for listing messages
  .controller('messagesCtrl', function ($scope, messages) {
    // forwarding the message functions
    $scope.messages = messages.getList;
    $scope.remove = messages.remove;
  })
})(angular)
