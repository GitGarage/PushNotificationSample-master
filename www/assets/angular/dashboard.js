app.controller("dashboard", ['$rootScope', '$scope', function ($rootScope, $scope) {
    var s = $scope;
    s.colors = [
        {name:'black', shade:'dark'},
        {name:'white', shade:'light', notAnOption: true},
        {name:'red', shade:'dark'},
        {name:'blue', shade:'dark', notAnOption: true},
        {name:'yellow', shade:'light', notAnOption: false}
    ];
    s.myColor = s.colors[2];

    $rootScope.$broadcast('forceResize');

}]);