(function (angular) {
  // Creates a sweet angulur module with no dependencies
  angular.module('twitter', [])

  // factories are singletons! So the same instance will shared across
  // all our controllers!
  .config(function ($interpolateProvider) {
    // Have to change the interpolate symbol because it's the same as djangos!
    $interpolateProvider.startSymbol('{+');
    $interpolateProvider.endSymbol('+}');
  })


  .factory('messages', function () {
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
    function getList () {
      return messages;
    }

    function createMessage (message) {
      messages.push({message: message, id: idCounter++});
    }

    function remove (message) {
      // filters out the message and creates a new array
      messages = messages.filter(function (m) {
        return m !== message;
      })
    }
  })


  // a controller for creating messages
  .controller('createMessageCtrl', function ($scope, messages) {
    // allows the use of the save method inside the template
    $scope.save = save;

    function save () {
      messages.createMessage($scope.newMessage);
      $scope.newMessage = ''; // resets our model
    }
  })

  // a controller for listing messages
  .controller('messagesCtrl', function ($scope, messages) {
    // forwarding the message functions
    $scope.messages = messages.getList;
    $scope.remove = messages.remove;
  })
})(angular)
