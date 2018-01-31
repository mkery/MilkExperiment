const humanLines = require("humanlines");
const svgParse = require('parse-svg-path');
const fs = require('fs')


class Actor {

  constructor(ctx, image, intelligence) {
    this.ctx = ctx
    this.intelligence = intelligence
    this.input = fs.readFileSync(image)
    var oParser = new DOMParser();
    this.oDOM = oParser.parseFromString(this.input, "text/xml");
    this.posX = 0;
    this.posY = 0;
    this.run = true;
    this.loop = false;
    this.clearOnDraw = false;
    this.dark = false
  }


  drawPoints5(steps, scaleFactor = 1){
    this.ctx.scale(scaleFactor, scaleFactor);
    this.ctx.beginPath()
    this.ctx.moveTo(steps[0].x,steps[0].y);
    var currentPoint = {x: Math.floor(steps[0].x), y: Math.floor(steps[0].y)}

    for(var i = 1; i < steps.length; i ++)
    {
      humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, Math.floor(steps[i].x), Math.floor(steps[i].y));
      currentPoint.x = Math.floor(steps[i].x)
      currentPoint.y = Math.floor(steps[i].y)
    }

    this.ctx.closePath()
  }


  drawPoints0(steps){
    this.ctx.moveTo(steps[0].x,steps[0].y);
    var currentPoint = {x: Math.floor(steps[0].x), y: Math.floor(steps[0].x)}

    for(var i = 1; i < steps.length; i ++)
    {
      humanLines.drawLine(this.ctx, currentPoint.x, currentPoint.y, Math.floor(steps[i].x), Math.floor(steps[i].y));
      currentPoint.x = Math.floor(steps[i].x)
      currentPoint.y = Math.floor(steps[i].y)
    }
  }


  drawPoints1(steps){
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


  drawLine(line)
  {
    humanLines.drawLine(this.ctx, Math.floor(line.getAttribute('x1')), Math.floor(line.getAttribute('y1')), Math.floor(line.getAttribute('x2')), Math.floor(line.getAttribute('y2')));
  }


  async draw(x, y, scaleFactor){
    if(!this.run)
      return
    if(!x)
      x = this.posX
    else {
      this.posX = x
    }
    if(!y)
      y = this.posY
    else {
      this.posY = y
    }
    this.ctx.resetTransform();
    this.ctx.translate(x,y);
    if(this.clearOnDraw)
      this.ctx.clearRect(0, -500, 200, 1000);
    var currentPoint = null
    var polygons = $(this.oDOM).find("polygon, polyline, line, path")
    var self = this
    var points = []
    polygons.each(function(index, item){
      if(item.tagName === 'path')
        //currentPoint = self.drawPath(svgParse(item.getAttribute('d')))
        return
      else if(item.tagName === 'line')
      {
        currentPoint = self.drawLine(item)
      }
      else{
        var points = item.points
        switch (self.intelligence) {
          case 5:
            self.drawPoints5(points, scaleFactor)
            break;
          case 1:
            self.drawPoints1(points, scaleFactor)
            break;
          case 0:
            self.drawPoints0(points, scaleFactor)
            break;
          default:
        }
      }
    })

    if(self.loop && self.run === true)
      setTimeout(self.draw.bind(self, null, null, scaleFactor), 400)
  }


  flail(){
    var self = this
    var polygons = $(this.oDOM).find("polygon, polyline")
    polygons.each(function(index, item){
      var sourcePoints = item.points
      // assume same number of points
      for(var i = 0; i < sourcePoints.length; i ++)
      {
        if(i % 2 === 0)
          sourcePoints[i].x -= 50
        sourcePoints[i].x += 20*Math.random()
        sourcePoints[i].y += 20
      }
    })
  }


  mutate(goalActor){
    var self = this
    var polygons = $(this.oDOM).find("polygon, polyline")
    var polygons2 = $(goalActor.oDOM).find("polygon, polyline")
    var goalPoints = []
    polygons2.each(function(index, item){
      goalPoints.push(... item.points)
    })

    polygons.each(function(index, item){
      var sourcePoints = item.points
      // assume same number of points
      for(var i = 0; i < sourcePoints.length; i ++)
      {
        var goal = goalPoints[i]
        if(goal){
          sourcePoints[i].x = self.lerp(sourcePoints[i].x, goal.x, 0.1)
          sourcePoints[i].y = self.lerp(sourcePoints[i].y, goal.y, 0.1)
        }
      }

    })
  }


  // Get the linear interpolation between two value
  lerp (value1, value2, amount) {
      amount = amount < 0 ? 0 : amount;
      amount = amount > 1 ? 1 : amount;
      return value1 + (value2 - value1) * amount;
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


  timeout(fun, ms) {
      return new Promise(resolve => setTimeout(() => {if(fun){fun();} resolve();}, ms));
  }

  async say(text, x, y, time)
  {
    var self = this
    var message = $('<div/>').addClass('message').css('top', y+'px').css('left', x+'px')
    if(this.dark)
      message.addClass('dark')
    $('body').append(message)
    for(var i =0; i < text.length; i++)
    {
      await self.timeout(null, time)
      message.html(message.html()+text.charAt(i))
    }
  }


  async beam(x, y, width, maxHeight)
  {
    var height = 0
    var beam = $('<div/>').addClass('beam').css('top', y+'px').css('left', x+'px').css('width', width+'px').css('height', height+'px')
    $('body').append(beam)
    var beam2 = $('<div/>').addClass('beam2').css('top', y+'px').css('left', x+width*.25/2+'px').css('width', width*.75+'px').css('height', height*1.25+'px')
    $('body').append(beam2)
    var t = 2;
    for(var height =0; height <= maxHeight; height += t)
    {
      await this.timeout(null, 15)
      beam.css('height', height+'px')
      beam2.css('height', height*1.25+'px')
      this.posY = y + height*1.25
    }
  }

  removeBeam()
  {
    $('.beam').remove()
    $('.beam2').remove()
  }


}// end of Actor

// expose the class
module.exports = Actor;
