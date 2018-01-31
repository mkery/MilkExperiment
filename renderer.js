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

const milkboy = new Actor(ctx, './images/test_1.svg', 0)


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
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(400, 400, 100, 0, Math.PI * 2, true); // Outer circle
      ctx.fill();
      title.draw(200,200)
      title.flail()
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
  var mom = new Actor(ctx, './images/test_2.svg', 5)
  mom.loop = true
  mom.clearOnDraw = true
  milkboy.loop = true
  mom.draw(70, 200)
  mom.say("MILK JR!!!", 35, 230, 150).then( () => {
    timeout(() => milkboy.draw(550, 0), 200)
    milkboy.beam(300, 0, 150, 200).then(() => {
      timeout(null, 500).then( () => { ctx.resetTransform(); ctx.clearRect(500, 0, 1000, 1000); })
      mom.say("YOU'RE BARELY A MILK CARTON.", 35, 280, 50).then(() => {
        timeout(null, 2000).then(() => {
          milkboy.loop = false
          milkboy.removeBeam()
          milkboy.say("╚═། ◑ ▃ ◑ །═╝",  280, 240, 10).then(() => {
                timeout(() => {
                  mom.say("WHAT WILL YOU DO WITH YOUR LIFE?", 35, 350, 20)
                  loopBuddy(() => {
                  milkboy.loop = true
                  ctx.resetTransform();
                  milkboy.draw(550, 0)
                  milkboy.mutate(mom)
                }, 2000, 100)
              }, 1000).then(() => {
                  mom.dark = true
                  wait(1000).then(() => {  mom.say("I CAN'T HELP BUT BE DISSAPOINTED IN YOU.", 35, 380, 100) })
                  loopBuddy(() => {
                    var rand = 20*Math.random()
                    if(Math.ceil(rand) % 2 === 0)
                      rand *= -1
                    milkboy.draw(milkboy.posX + rand, milkboy.posY + 10)
                  }, 8000, 100).then(() => {
                    $('.message').remove()
                    mom.loop = false
                    mom.run = false
                    mom = null
                    milkboy.loop = false
                    milkboy.run = false
                    ctx.resetTransform();
                    ctx.clearRect(0, 0, 10000, 10000);
                    darkSequence()
                  })
                })
              })
        })
      })
    })
  })
}


async function darkSequence()
{
  $('body').addClass('dark')
  milkboy.dark = true
  await wait(500)
  ctx.beginPath();
  ctx.fillStyle = 'yellow';
  ctx.arc(200, 400, 200, 0, Math.PI * 2, true); // Outer circle
  ctx.fill();
  milkboy.run = true
  milkboy.draw(-10, 300)
  ctx.resetTransform();
  await loopBuddy(() => {
    milkboy.run = true
    milkboy.draw(milkboy.posX + 20, milkboy.posY)
  }, 1000, 100)
  loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 400, 400);
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(200, 400, 200, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    milkboy.draw(milkboy.posX, milkboy.posY)
  }, 10000, 100)
  await wait(500)
  await milkboy.say("HELLO THERE?", 35, 400, 100)
  await wait(500)
  await milkboy.say("IS ANYONE OUT HERE?", 35, 450, 100)
  await wait(500)
  await milkboy.say("IT'S ME, MILK JR.", 35, 500, 100)
  loopBuddy(() => {
    ctx.resetTransform();
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(milkboy.posX + 5, 400, 200, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    milkboy.draw(milkboy.posX + 10, milkboy.posY)
  }, 9000, 100).then(() => {
    $('.message').remove()
    ctx.resetTransform();
    ctx.clearRect(0, 0, 10000, 10000);
    yellowSequence()
  })
}

//momSequence()
//titleSequence()
//darkSequence()
yellowSequence()


async function yellowSequence()
{
  $('body').removeClass('dark')
  $('body').addClass('bananna')
  var bananna0 = new Actor(ctx, './images/bananna.svg', 5)
  bananna0.loop = true
  bananna0.clearOnDraw = true
  bananna0.draw(300, 200, 4)


}



/*var milkboy = new Actor(ctx, './images/test_1.svg')
var mom = new Actor(ctx, './images/test.svg')
stationaryLoop(mom, milkboy)
wait(500)
mom.warning("MOM", 25, 170)
wait(500)
mom.message("HELLO MILK BOY", 25, 270)*/
