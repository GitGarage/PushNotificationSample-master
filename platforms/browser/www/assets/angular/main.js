app.controller("main", ['$scope', '$rootScope', function ($scope, $rootScope) {
    var s = $scope;
    var width = 0;
    var x1 = 0;
    var x2 = 0;
    var initial;
    var counter = 0;
    var refuse = false;
    s.fontSize = '1em';
    s.tabs = [];
    s.frame1url = 'frame1.html';
    s.frame2url = 'frame2.html';
    s.frame3url = 'frame3.html';

    s.init = function() {
        $('title').html('E-Z·TOEIC');
        $('#shield').draggable({
            axis: 'x',
            scroll: false,
            stop: function(event,ui) {
                $(event.target).css('left', '-100%');
            }
        });
        window.addEventListener('resize', function() {
            resized();
        }, false);
    };

    s.lastY = 0;

    function initDrag() {
        width = $('#frame2').width();
        lastTime = -width;
        var framehold = $('#frameholder');
        framehold.draggable({
            containment: [-width,0,width,0],
            distance: 30,
            dynamic: false,
            drag: function(event, ui) {
                if (!refuse)
                {
                    x1 = $(event.target).offset().left;
                    var originalPosition = ui.helper.data('draggableXY.originalPosition');
                    var deltaX = Math.abs(originalPosition.left - ui.position.left);
                    var deltaY = Math.abs(originalPosition.top - ui.position.top);

                    var newDrag = ui.helper.data('draggableXY.newDrag');
                    ui.helper.data('draggableXY.newDrag', false);

                    var xMax = newDrag ? Math.max(deltaX, deltaY) === deltaX : ui.helper.data('draggableXY.xMax');
                    ui.helper.data('draggableXY.xMax', xMax);

                    var newPosition = ui.position;
                    if(xMax) {
                        newPosition.top = originalPosition.top;
                    }
                    if(!xMax){
                        $('#frame1').css('top', newPosition.top + s.lastY);

                        newPosition.top = 0;
                        newPosition.left = originalPosition.left;
                    }
                    var height = $('#frame1').get(0).scrollHeight - $(window).height();
                    var topper = $('#frame1').offset().top;
                    if (-height >= topper)
                    {
                        $('#frame1').css('top', -height);
                    }
                    if (0 <= topper)
                    {
                        $('#frame1').css('top', 0);
                    }

                    return newPosition;
                }
            },
            scroll: false,
            start: function (event, ui) {
                counter++;
                if (counter == 1)
                {
                    ui.helper.data('draggableXY.originalPosition', ui.position || {top: 0, left: 0});
                    ui.helper.data('draggableXY.newDrag', true);
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
                resized();
                if (!refuse)
                {
                    s.lastY = $('#frame1').offset().top;
                    var width = $('#frame2').width();
                    var framehold = $('#frameholder');
                    var height = $('#frame1').get(0).scrollHeight;
                    $('#frame1').css('height', height);
                    framehold.draggable({
                        containment: [-width,-height,width,height]
                    });
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
                        $rootScope.$broadcast('forceRedraw');
                    });
                }
            }
        });
    }

    s.width1 = 0;
    s.height1 = 0;
    s.top1 = 0;
    s.left1 = 0;
    s.width2 = 0;
    s.height2 = 0;
    s.top2 = 0;
    s.left2 = 0;


    function resized() {
        initDrag();
    }

    $scope.$on('forceResize', function(event, args) {
        resized();
    });

}]);