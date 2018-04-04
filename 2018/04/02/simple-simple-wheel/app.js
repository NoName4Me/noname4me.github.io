Provider.controller('MainCtrl', function ($scope) {
  $scope.current = '';
  $scope.items = [];
  $scope.add = function () {
    $scope.items.push($scope.current);
    $scope.current = '';
  };
});

DOMCompiler.bootstrap();