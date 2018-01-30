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


function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function timeout(fun, ms) {
    return new Promise(resolve => setTimeout(() => {if(fun){fun();} resolve();}, ms));
}

async function loopBuddy(fun, time, repeat){
  for(var i = 0; i < time/repeat; i ++){
    await timeout(fun, repeat)
  }
  return
}


var title = new Actor(ctx, './images/title_1.svg', 5)
var titleEnd = new Actor(ctx, './images/title_no.svg', 0)
async function titleSequence(){ loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 1000, 1000);
    title.draw(200, 200)
  }, 3000, 500).then( () => {
    loopBuddy(() => {
      ctx.resetTransform();
      ctx.clearRect(0, 0, 1000, 1000);
      title.draw(200,200)
      title.mutate(titleEnd)
    }, 5000, 100).then( () => {
      ctx.resetTransform();
      ctx.clearRect(0, 0, 1000, 1000);
    }).then(() => {
      ctx.clearRect(0, 0, 1000, 1000);
    }).then(() => {
      title.run = false
      ctx.resetTransform();
      ctx.clearRect(0, 0, 1000, 1000);
      momSequence()
    })
  })
}


async function momSequence(){
  timeout(null, 500)
  //Mom enters
  var milkboy = new Actor(ctx, './images/test_1.svg', 0)
  var mom = new Actor(ctx, './images/test_2.svg', 5)
  mom.loop = true
  milkboy.loop = true
  mom.draw(70, 200)
  mom.say("MILK BOY!!!", 35, 230, 150).then( () => {
    timeout(() => milkboy.draw(550, 0), 200)
    milkboy.beam(300, 0, 150, 300).then(() => {
      timeout(null, 500).then( () => { ctx.resetTransform(); ctx.clearRect(0, 0, 1000, 1000); })
      mom.say("YOU ARE A MESS.", 35, 280, 50).then(() => {
        timeout(null, 2000).then(() => {
          milkboy.loop = false
          milkboy.removeBeam()
          milkboy.say("╚═། ◑ ▃ ◑ །═╝",  280, 280, 10).then(() => {
            timeout(() => loopBuddy(() => {
              milkboy.loop = true
              ctx.resetTransform();
              milkboy.draw(550, 0)
              milkboy.mutate(mom)
            }, 2000, 100).then(() => {
              milkboy.say("F",  280, 340, 10).then(() => {
                milkboy.say("YEAH",  300, 340, 10).then(() => {
                  loopBuddy(() => {
                    milkboy.draw(milkboy.posX, milkboy.posY + 10)
                  }, 8000, 100)
                })
              })
            })
            , 1000)
          })
        })
      })
    })
  })
  /*ctx.translate(600,200);
  milkboy.draw()
  timeout(null, 500)
  ctx.resetTransform();
  ctx.translate(70,200);
  mom.draw()
  ctx.resetTransform();
  ctx.translate(600,200);
  loopBuddy(() => {
    ctx.translate(0,2);
    ctx.clearRect(0, 0, 1000, 1000);
    milkboy.draw()
    milkboy.mutate(mom)
  }, 8000, 100)*/
}

//momSequence()
titleSequence()




/*var milkboy = new Actor(ctx, './images/test_1.svg')
var mom = new Actor(ctx, './images/test.svg')
stationaryLoop(mom, milkboy)
wait(500)
mom.warning("MOM", 25, 170)
wait(500)
mom.message("HELLO MILK BOY", 25, 270)*/
