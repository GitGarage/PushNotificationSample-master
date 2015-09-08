app.controller("splash", ['$scope', function ($scope) {
    var s = $scope;
    var m, width;

    s.init = function() {
        spin();
    };

    function spin() {
        m = $('#marquee');
        m.css('top', ($(window).height()/2) - (m.height()/2));
        width = m.width();
        m.css('left', $(window).width());
        m.animate({
            left: -width
        }, {
            duration: $(window).width() * 15,
            specialEasing: {
                left: "linear"
            },
            complete: function() {
                spin();
            }
        });
    }
}]);