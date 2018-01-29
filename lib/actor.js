const humanLines = require("humanlines");
const svgParse = require('parse-svg-path');
const fs = require('fs')


class Actor {

  constructor(ctx, image) {
    this.ctx = ctx
    this.input = fs.readFileSync(image)
    var oParser = new DOMParser();
    this.oDOM = oParser.parseFromString(this.input, "text/xml");
  }


  drawPoints(steps, lastPoint){
    this.ctx.moveTo(steps[0].x,steps[0].x);
    var currentPoint = {x: Math.floor(steps[0].x), y: Math.floor(steps[0].x)}

    for(var i = 0; i < steps.length; i ++)
    {
      humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, Math.floor(steps[i].x), Math.floor(steps[i].y));
      currentPoint.x = Math.floor(steps[i].x)
      currentPoint.y = Math.floor(steps[i].y)
    }

  }


  drawPath(steps){
    var currentPoint = {x: 0, y: 0}
    steps.forEach((step, index) => {
      switch(step[0]){
        case "m":
        case "M":
          this.ctx.translate(step[1], step[2]);
          currentPoint.x = step[1]
          currentPoint.y = step[2]
          break;
        case "l":
        case "c":
          humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, currentPoint.x + step[1], currentPoint.y + step[2]);
          currentPoint.x += step[1]
          currentPoint.y += step[2]
          break;
        case "L":
        case "C":
          humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, step[1], step[2]);
          currentPoint.x = step[1]
          currentPoint.y = step[2]
          break;
        case "v":
          humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, currentPoint.x, currentPoint.y + step[1]);
          currentPoint.y += step[1]
          break;
        case "V":
          humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, currentPoint.x, step[1]);
          currentPoint.y = step[1]
          break;
        case "h":
          humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, currentPoint.x + step[1], currentPoint.y);
          currentPoint.x += step[1]
          break;
        case "H":
          humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, step[1], currentPoint.y);
          currentPoint.x = step[1]
          break;
        default:
      }
    })
  }


  draw(){
    var polygons = $(this.oDOM).find("polygon, polyline")
    var self = this
    polygons.each(function(index, item){
      var points = item.points
      //redraw(steps)
      self.drawPoints(points)
    })

    var lines = $(this.oDOM).find("line")
  }


  mutate(sourcePoints, goalPoints){
    // assume same number of points
    for(var i = 0; i < sourcePoints.length; i ++)
    {
      var goal = goalPoints[i]
      if(goal){
        sourcePoints[i].x = this.lerp(sourcePoints[i].x, goal.x, 0.1)
        sourcePoints[i].y = this.lerp(sourcePoints[i].y, goal.y, 0.1)
      }
    }
    return sourcePoints
  }


  // Get the linear interpolation between two value
  lerp (value1, value2, amount) {
      amount = amount < 0 ? 0 : amount;
      amount = amount > 1 ? 1 : amount;
      return value1 + Math.random()*(value2 - value1) * amount;
  }


  warning(text, x, y)
  {
    var warning = $('<div>WARNING: '+text+'</div>').addClass('warning').css('top', y+'px').css('left', x+'px')
    $('body').append(warning)
  }


  message(text, x, y)
  {
    var message = $('<div>'+text+'</div>').addClass('message').css('top', y+'px').css('left', x+'px')
    $('body').append(message)
  }


}// end of Actor

// expose the class
module.exports = Actor;
