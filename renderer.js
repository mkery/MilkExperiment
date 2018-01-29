// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const humanLines = require("humanlines");
const svgParse = require('parse-svg-path');
const fs = require('fs')
window.$ = window.jQuery = require("./jquery/jquery-3.3.1.min.js");


// generate a pencil-like texture... (optional)
const texture = humanLines.generatePencilTexture();

const canvas = document.getElementById("artboard");
const ctx = canvas.getContext("2d");
const pattern = ctx.createPattern(texture, 'repeat');

ctx.strokeStyle = pattern;
ctx.lineWidth = 3;
ctx.clearRect(0, 0, 1000, 1000);


function drawPoints(steps, lastPoint){
  ctx.moveTo(steps[0].x,steps[0].x);
  var currentPoint = {x: Math.floor(steps[0].x), y: Math.floor(steps[0].x)}

  for(var i = 0; i < steps.length; i ++)
  {
    console.log(steps[i])
    humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, Math.floor(steps[i].x), Math.floor(steps[i].y));
    currentPoint.x = Math.floor(steps[i].x)
    currentPoint.y = Math.floor(steps[i].y)
  }

}


function drawPath(steps){
  var currentPoint = {x: 0, y: 0}
  steps.forEach((step, index) => {
    switch(step[0]){
      case "m":
      case "M":
        ctx.translate(step[1], step[2]);
        currentPoint.x = step[1]
        currentPoint.y = step[2]
        break;
      case "l":
      case "c":
        humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, currentPoint.x + step[1], currentPoint.y + step[2]);
        currentPoint.x += step[1]
        currentPoint.y += step[2]
        break;
      case "L":
      case "C":
        humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, step[1], step[2]);
        currentPoint.x = step[1]
        currentPoint.y = step[2]
        break;
      case "v":
        humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, currentPoint.x, currentPoint.y + step[1]);
        currentPoint.y += step[1]
        break;
      case "V":
        humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, currentPoint.x, step[1]);
        currentPoint.y = step[1]
        break;
      case "h":
        humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, currentPoint.x + step[1], currentPoint.y);
        currentPoint.x += step[1]
        break;
      case "H":
        humanLines.drawLine(ctx, currentPoint.x, currentPoint.y, step[1], currentPoint.y);
        currentPoint.x = step[1]
        break;
      default:
    }
  })
}

function redraw (steps){
  ctx.resetTransform();
  ctx.clearRect(0, 0, 1000, 1000);
  drawSvg(steps)
  setTimeout(redraw.bind(this, steps), 500);
}


function redrawPoints (oDOM){
  ctx.resetTransform();
  ctx.translate(100,100)
  ctx.clearRect(0, 0, 1000, 1000);
  var polygon = $(oDOM).find("polygon").each(function(index, item){
    var points = item.points
    //redraw(steps)
    drawPoints(points)
  })
  setTimeout(redrawPoints.bind(this, oDOM), 500);
}


var input = fs.readFileSync('./images/test.svg')
var oParser = new DOMParser();
var oDOM = oParser.parseFromString(input, "text/xml");
redrawPoints(oDOM)
