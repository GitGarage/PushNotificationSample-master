app.controller("main", ['$scope', function ($scope) {
    var s = $scope;
    var width = 0;
    var x1 = 0;
    var x2 = 0;
    var initial;
    var counter = 0;
    var refure = false;
    s.tabs = [];

    s.init = function() {
        $('title').html('E-Z·TOEIC');
        $('#shield').draggable({
            axis: 'x',
            scroll: false,
            stop: function(event,ui) {
                $(event.target).css('left', '-100%');
            }
        });
        resized();
        window.addEventListener('resize', function() {
            resized();
        }, false);
    };

    function initDrag() {
        width = $('#frame2').width();
        lastTime = -width;
        var framehold = $('#frameholder');
        framehold.draggable({
            containment: [-width,0,width,0],
            drag: function(event, ui) {
                if (!refuse)
                {
                    x1 = $(event.target).offset().left;
                }
            },
            scroll: false,
            start: function (event, ui) {
                counter++;
                if (counter == 1)
                {
                    x2 = $(event.target).offset().left;
                    initial = framehold.offset().left;
                    refuse = false;
                }
                else
                {
                    refuse = true;
                    $('#shield').show();
                }
            },
            stop: function(event, ui) {
                if (!refuse)
                {
                    var best = 0;
                    var title = 0;
                    for (var i = -1; i <= 1; i++)
                    {
                        var comp = i * width;
                        var size = comp + x1;
                        if (best < size)
                        {
                            best = size;
                            title = -comp;
                            if (best <= width && best >= 0)
                            {
                                var right = x1 - x2 > 0;
                                if (!right && best <= 5 * width / 6)
                                {
                                }
                                else if (right && best > width / 6)
                                {
                                    title += width;
                                }
                                else
                                {
                                    title = initial;
                                }
                                break;
                            }
                        }
                    }
                    $('#shield').show();
                    framehold.animate({left: title}, 500, function() {
                        if (title != initial)
                        {
                            if (right)
                            {
                                var target = $('.slide:last');
                                framehold.prepend(target);
                                target.css('left','-100%');
                                target.next().css('left','0');
                                target.next().next().css('left','100%');
                            }
                            else
                            {
                                var target = $('.slide:first');
                                framehold.append(target);
                                target.css('left','100%');
                                target.prev().css('left','0');
                                target.prev().prev().css('left','-100%');
                            }
                            framehold.css('left', 0);
                        }
                        $('#shield').hide();
                        counter = 0;
                    });
                }
            }
        });
    }

    function resized() {
        initDrag();
    }

}]);