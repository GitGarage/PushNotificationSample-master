app.controller("dashboard", ['$rootScope', '$sce', '$scope', function ($rootScope, $sce, $scope) {
    var s = $scope;
    s.data = {};
    s.canvas = 1;
    s.zoom = false;
    var moving = false;

    s.init = function() {
           // for debugging
        // TODO: Connect this to the server for real, fake data

        window.addEventListener('resize', function() {
            moveGraph();
            if (s.zoom)
            {
                resize(0);
            }
        }, false);
    };

    function resize(time) {
        var shadow = $('.shadow');
        var graph = $('.graph');
        var background = $('.background');
        if (s.canvas == 1)
        {
            shadow.show();
        }
        var width = $(window).width() > 620 ? 620 : $(window).width();
        var height = (width * 450) / 620;
        background.fadeIn(500);
        graph.animate({
            left: ($(window).width() - width) / 2,
            top: ($(window).height() - height) / 2,
            width: width,
            height: height
        }, time, function(){
            moving = false;
            shadow.show();
        });
    }

    s.zoomIn = function(index) {
        if (!moving)
        {
            moving = true;
            var graph = $('.graph');
            var background = $('.background');
            var shadow = $('.shadow');
            var graph1 = $(graph.get(0));
            var graph2 = $(graph.get(1));
            if (!s.zoom)
            {
                s.zoom = true;
                var x1 = graph1.offset().left;
                var y1 = graph1.offset().top;
                var x2 = graph2.offset().left;
                var y2 = graph2.offset().top;
                graph.css('z-index', 50);
                graph.css('position', 'absolute');
                graph1.css('left', x1);
                graph1.css('top', y1);
                graph2.css('left', x2);
                graph2.css('top', y2);
                resize(500);
            }
            else
            {
                s.zoom = false;
                var X1 = $(shadow.get(0)).offset().left;
                var Y1 = $(shadow.get(0)).offset().top;
                var X2 = $(shadow.get(1)).offset().left;
                var Y2 = $(shadow.get(1)).offset().top;
                background.fadeOut(500);
                graph1.animate({
                    left: X1,
                    top: Y1,
                    width: 354,
                    height: 257
                }, 500, function(){
                    graph1.css('position', 'inherit');
                    shadow.hide();
                    moving = false;
                });
                graph2.animate({
                    left: X2,
                    top: Y2,
                    width: 354,
                    height: 257
                }, 500, function(){
                    graph2.css('position', 'inherit');
                });
            }
        }
    };

    function moveGraph() {
        if ($(window).height() > $(window).width())
        {
            s.$apply(function () {
                s.canvas = 2;
            });
        }
        else
        {
            s.$apply(function () {
                s.canvas = 1;
            });
        }
    }

    function setFakeData() {
        var listening = [50 + rand(51),50 + rand(51),50 + rand(51),50 + rand(51)];
        var reading = [50 + rand(51),50 + rand(51),50 + rand(51)];
        s.data.goal = 1000 - rand(401);
        s.data.date = $.datepicker.formatDate('mm/dd/yy', new Date());
        s.data.listening = [];
        s.data.reading = [];
        for (l in listening)
        {
            var int = parseInt(l) + 1;
            s.data.listening[l] = {};
            s.data.listening[l].score = listening[l];
            s.data.listening[l].title = $sce.trustAsHtml('Lesson&nbsp;' + int + ':');
            s.data.listening[l].mypace = '' + (rand(3) + 2) + 's';
            s.data.listening[l].yourpace = '' + (rand(3) + 2) + 's';
        }
        for (r in reading)
        {
            var int = parseInt(r) + 5;
            s.data.reading[r] = {};
            s.data.reading[r].score = reading[r];
            s.data.reading[r].title = $sce.trustAsHtml('Lesson&nbsp;' + int + ':');
            s.data.reading[r].mypace = '' + (rand(61) + 20) + 's';
            s.data.reading[r].yourpace = '' + (rand(61) + 20) + 's';
        }
        s.data.readingWPM = {};
        s.data.readingWPM.percent = 50 + rand(51);
        s.data.readingWPM.total = Math.floor((150 * s.data.readingWPM.percent) / 100);
        s.data.vocabulary = {};
        s.data.vocabulary.percent = 50 + rand(51);
        s.data.vocabulary.total = (8000 * s.data.vocabulary.percent) / 100;
        s.data.improvement = [50 + rand(51),50 + rand(51),50 + rand(51),50 + rand(51),50 + rand(51),50 + rand(51),50 + rand(51)];
    }

    function rand(integer) {
        return Math.floor(Math.random() * integer);
    }

    function drawLine (context, x1, y1, x2, y2, first)
    {
        var x, y;
        var lastX, lastY;
        lastX = x1;
        lastY = y1;
        context.moveTo(x1, y1);
        for (var i = 1; i <= 10; i++)
        {
            x = ((x1 * i) + (x2 * (100 - i)))/100.0;
            y = ((y1 * i) + (y2 * (100 - i)))/100.0;
            drawLine2 (context, lastX, lastY, x, y, first);
            lastX = x;
            lastY = y;
        }
    }

    function drawLine2 (context, x1, y1, x2, y2, first)
    {
        var c = (x1 + x2) / 2;
        var d = (y1 + y2) / 2;
        if (!first)
        {
            context.quadraticCurveTo(x1, y1, c, d);
            context.quadraticCurveTo(c, d, x2, y2);
        }
        else
        {
            drawLine(context, x1, y1, c, d, false);
            drawLine(context, c, d, x2, y2, false);
        }
    }

    angular.element(document).ready(function() {
        setFakeData();

        var cell = 1;
        var tg = [$('#thisGraph'),$('#thisGraph2')];
        for (g in tg)
        {
            tg[g].attr('width', 620 * cell);
            tg[g].attr('height', 450 * cell);

            var canvas = tg[g].get(0);

            var context = canvas ? canvas.getContext('2d') : null;
            context.clearRect(0, 0, canvas.width, canvas.height);
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = 200 * cell;
            context.lineWidth = 3 * cell;
            context.strokeStyle = '#000000';
            context.lineCap = 'round';
            context.lineJoin = 'round';

            for (var i = 0; i < 7; i++) {
                context.beginPath();
                context.arc(centerX, centerY, radius, 1.5 * Math.PI + (((2.0/7.0) * Math.PI) * i), 1.5 * Math.PI + (((2.0/7.0) * Math.PI) * (i + 1)), false);
                context.lineTo(centerX, centerY);
                context.stroke();
                context.closePath();
            }

            context.font = "" + (20 * cell) + "px Arial";
            context.fillText("Previous", 520 * cell, 30 * cell);
            context.fillText("Now", 520 * cell, 60 * cell);

            var cos = 0.62348980185873353052500488400424;
            var sin = 0.78183148246802980870844452667406;
            var greenX = [7];
            var greenY = [7];
            var blueX = [7];
            var blueY = [7];
            var newX = centerX;
            var newY = centerY - radius;
            var oldX;
            var oldY;
            greenX[0] = newX;
            greenY[0] = newY;
            blueX[0] = newX;
            blueY[0] = newY;

            for (var i = 0; i < 6; i++) {
                oldX = newX - centerX;
                oldY = newY - centerY;
                newX = centerX + (oldX * cos) - (oldY * sin);
                newY = centerY + (oldX * sin) + (oldY * cos);
                greenX[i + 1] = newX;
                greenY[i + 1] = newY;
                blueX[i + 1] = newX;
                blueY[i + 1] = newY;
            }

            for (var i = 0; i < 4; i++)
            {
                var myPart = s.data.listening[i].score;
                var yourPart = 100 - myPart;
                greenX[(i + 7) % 7] = ((greenX[(i + 7) % 7] * myPart) + (centerX * yourPart)) / 100;
                greenY[(i + 7) % 7] = ((greenY[(i + 7) % 7] * myPart) + (centerY * yourPart)) / 100;
            }
            for (var i = 0; i < 3; i++)
            {
                var myPart = s.data.reading[i].score;
                var yourPart = 100 - myPart;
                greenX[(i + 4) % 7] = ((greenX[(i + 4) % 7] * myPart) + (centerX * yourPart)) / 100;
                greenY[(i + 4) % 7] = ((greenY[(i + 4) % 7] * myPart) + (centerY * yourPart)) / 100;
            }
            context.font = "" + (16 * cell) + "px Arial";
            var xshift = [-20 * cell, 5 * cell, 8 * cell, -10 * cell, -30 * cell, -50 * cell, -45 * cell];
            var yshift = [-7 * cell, -5 * cell, 10 * cell, 25 * cell, 25 * cell, 10 * cell, -5 * cell];
            for (var i = 0; i < 7; i++)
            {
                context.fillText("Part " + ((i) % 7 + 1), blueX[i % 7] + xshift[i], blueY[i % 7] + yshift[i]);

                var myPart = s.data.improvement[i];
                var yourPart = 100 - myPart;
                blueX[i%7] = ((blueX[i%7] * myPart) + (centerX * yourPart)) / 100;
                blueY[i%7] = ((blueY[i%7] * myPart) + (centerY * yourPart)) / 100;
            }

            context.strokeStyle = '#3350D8';
            context.lineTo(centerX, centerY);
            context.beginPath();
            context.translate(0.5,0.5);
            for (var i = 0; i < 8; i++) {
                drawLine(context, blueX[i % 7], blueY[i % 7], blueX[(i+1) % 7], blueY[(i+1) % 7], i==0);
//            context.lineTo(blueX[i % 7], blueY[i % 7]);
                //          context.stroke();
            }
            context.stroke();
            context.closePath();

            context.strokeStyle = '#8e3931';
            context.lineTo(centerX, centerY);
            context.beginPath();
            context.stroke();
            for (var i = 0; i < 8; i++) {
                drawLine(context, greenX[i % 7], greenY[i % 7], greenX[(i+1) % 7], greenY[(i+1) % 7], i==0);
            }
            context.stroke();
            context.closePath();

            for (var i = 0; i < 2; i++)
            {
                context.strokeStyle = ['#3350D8', '#8e3931'][i];
                context.beginPath();
                context.lineTo(490 * cell, 15 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(510 * cell, 15 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(510 * cell, 30 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(490 * cell, 30 * cell + (30 * cell * i));
                context.stroke();
                context.lineTo(490 * cell, 15 * cell + (30 * cell * i));
                context.stroke();
                context.closePath();
            }

            var xLines = [10];
            var yLines = [10];
            var xLine = [10];
            var yLine = [10];
            context.strokeStyle = "#000000";
            context.font = "" + (10 * cell) + "px Arial";
            for (var i = 0; i < 5; i++) {
                xLines[0 + (2 * i)] = centerX - 5 * cell;
                yLines[0 + (2 * i)] = centerY - (40 * cell * (i + 1));
                xLines[1 + (2 * i)] = centerX + 5 * cell;
                yLines[1 + (2 * i)] = centerY - (40 * cell * (i + 1));
                xLine[i] = centerX;
                yLine[i] = centerY - (40 * (i + 1));
                context.fillText("" + ((i + 1) * 20), centerX + 8 * cell + (i == 4 ? -3 * cell : 0), centerY - (40 * cell * (i + 1)) + 5 * cell + (i == 4 ? 7 * cell : 0));
            }
            context.lineWidth = cell;
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 4; j++) {
                    context.beginPath();
                    context.moveTo(xLines[j * 2], yLines[j * 2]);
                    context.lineTo(xLines[(j * 2) + 1], yLines[(j * 2) + 1]);
                    context.stroke();
                    context.closePath();
                }
                for (var j = 0; j < 10; j++) {
                    oldX = xLines[j] - centerX;
                    oldY = yLines[j] - centerY;
                    xLines[j] = centerX + (oldX * cos) - (oldY * sin);
                    yLines[j] = centerY + (oldX * sin) + (oldY * cos);
                }
            }
            tg[g].css('height','257px');

            moveGraph();
            $rootScope.$broadcast('forceResize');
        }
    });
}]);