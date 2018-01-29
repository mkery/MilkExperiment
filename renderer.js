// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require("./jquery/jquery-3.3.1.min.js");
const humanLines = require("humanlines");
const Actor = require("./lib/actor.js");

// generate a pencil-like texture... (optional)
const texture = humanLines.generatePencilTexture();

const canvas = document.getElementById("artboard");
const ctx = canvas.getContext("2d");
const pattern = ctx.createPattern(texture, 'repeat');

ctx.strokeStyle = pattern;
ctx.lineWidth = 3;
ctx.clearRect(0, 0, 1000, 1000);



function redrawPoints (oDOM, oDOM2){
  ctx.resetTransform();
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.translate(100,100)
  var polygons = $(oDOM).find("polygon, polyline")

  polygons.each(function(index, item){
    var points = item.points
    //redraw(steps)
    drawPoints(points)
  })

  ctx.translate(500,0)
  var polygons2 = $(oDOM2).find("polygon, polyline")
  polygons2.each(function(index, item){
    var points = item.points
    //redraw(steps)
    drawPoints(points)
    //if( polygons[index])
      //item.points = mutate(points, polygons[index].points)
  })

  setTimeout(redrawPoints.bind(this, oDOM, oDOM2), 200);
}


function stationaryLoop(actors){
  ctx.resetTransform();
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.translate(50,50);
  actors.forEach((actor, index)=>{
    actor.draw()
    ctx.translate(500,20);
  })
  //setTimeout(stationaryLoop.bind(this, actors), 300);
}


var title = new Actor(ctx, './images/title.svg')
stationaryLoop([title])
/*var milkboy = new Actor(ctx, './images/test_1.svg')
var mom = new Actor(ctx, './images/test.svg')
stationaryLoop(mom, milkboy)
wait(500)
mom.warning("MOM", 25, 170)
wait(500)
mom.message("HELLO MILK BOY", 25, 270)*/
