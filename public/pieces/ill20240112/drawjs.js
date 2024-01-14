$(function()
  {
  var $svg = $('#svg');
  var $path = $('#path');
  var CTM = $path[0].getScreenCTM();
  var point = $(svg)[0].createSVGPoint();
  var points = []
  $svg.on('mousedown', function(ev)
    {
    point.x = ev.pageX;
    point.y = ev.pageY;
    point = point.matrixTransform(CTM.inverse());
    points.push({x:+point.x, y:+point.y});
    $path.attr('d', 'M'+point.x+','+point.y+'L'+point.x+','+point.y); // тут оптимизоровать не хотелось
    function mouseMove(ev)
      {
      point.x = ev.pageX;
      point.y = ev.pageY;
      point = point.matrixTransform(CTM.inverse());
      $path.attr('d', $path.attr('d')+' '+point.x+','+point.y);
      points.push({x:+point.x, y:+point.y});
      }
    function mouseUp(ev)
      {
      mouseMove(ev);
      console.log(points);
//      console.log($.toJSON(points));
      $(window).off('mousemove', mouseMove);
      $(window).off('mouseup', mouseUp);
      }
    $(window).on('mousemove', mouseMove);
    $(window).on('mouseup', mouseUp);
    })
  })
