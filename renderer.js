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
const milkboy_orig = new Actor(ctx, './images/test_1.svg', 0)


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


var title = new Actor(ctx, './images/title.svg', 5)
var titleEnd = new Actor(ctx, './images/title_no.svg', 0)
var unfilm = new Image(198, 45);   // using optional size for image
unfilm.src = './images/unfilm.svg';
var par = new Image(161, 101);   // using optional size for image
par.src = './images/par.svg';
var mb = new Actor(ctx, './images/marybeth.svg', 5)
mb.dark = true

async function titleSequence(){ loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 1000, 1000);
    title.draw(200, 200)
  }, 3000, 500).then( () => {
    mb.say("MB for Art & ML Assignment 1", 450, 400, 100)
    loopBuddy(() => {
      ctx.resetTransform();
      ctx.clearRect(0, 0, 1000, 1000);
      title.draw(200,200)
      title.flail()
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.arc(400, 400, 200, 0, Math.PI * 2, true); // Outer circle
      ctx.fill();
      ctx.resetTransform();
      ctx.drawImage(unfilm, 450, 450, 396, 90);
      ctx.resetTransform();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 155, 155, 0.8)';
      ctx.arc(750, 600, 100, 0, Math.PI * 2, true); // Outer circle
      ctx.fill();
      ctx.resetTransform();
      ctx.drawImage(par, 700, 600, 161, 101);
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      ctx.arc(900, 1000, 300, 0, Math.PI * 2, true); // Outer circle
      ctx.fill();
      mb.draw(200, 700,3)
      ctx.resetTransform();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 155, 155, 0.8)';
      ctx.arc(1000, 800, 100, 0, Math.PI * 2, true); // Outer circle
      ctx.fill();
    }, 8000, 100).then( () => {
      ctx.resetTransform();
      ctx.clearRect(0, 0, 1000, 1000);
    }).then(() => {
      ctx.clearRect(0, 0, 1000, 1000);
    }).then(() => {
      title.run = false
      $('.message').remove()
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
          //milkboy.removeBeam()
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
                    ctx.resetTransform();
                    ctx.clearRect(milkboy.posX, milkboy.posY + 10, 200, 20);
                    ctx.resetTransform();
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255, 155, 155, 0.2)';
                    ctx.arc(milkboy.posX, milkboy.posY, 100, 0, Math.PI * 2, true); // Outer circle
                    ctx.fill();
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
                    milkboy.removeBeam()
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
  await milkboy.say("HELLO THERE UNIVERSE?", 35, 400, 100)
  await wait(500)
  await milkboy.say("IS ANYONE OUT HERE?", 35, 450, 100)
  await wait(500)
  await milkboy.say("IT'S ME, MILK JR.", 35, 500, 100)
  var flip = true
  wait(800).then(() => {
    milkboy.say("I'D LIKE TO FIND SOMETHING GOOD IN THIS LIFE.", 300, 400, 200)
  })
  loopBuddy(() => {
    ctx.resetTransform();
    ctx.beginPath();
    if(flip)
      ctx.fillStyle = 'rgba(255,255,61,0.5)';
    else
      ctx.fillStyle = 'rgba(255, 155, 155, 0.2)';
    flip = !flip
    ctx.arc(milkboy.posX + 5, 400, 200, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    milkboy.draw(milkboy.posX + 10, milkboy.posY)
  }, 12000, 100).then(() => {
    $('.message').remove()
    ctx.resetTransform();
    ctx.clearRect(0, 0, 10000, 10000);
    yellowSequence()
  })
}

async function yellowSequence()
{
  $('body').removeClass('dark')
  $('body').addClass('bananna')
  milkboy.run = true
  milkboy.draw(-10, 600)
  ctx.resetTransform();
  await loopBuddy(() => {
    milkboy.run = true
    milkboy.draw(milkboy.posX + 20, milkboy.posY)
  }, 600, 100)

  var rotate = 0
  var banannafo = new Actor(ctx, './images/bananna_simple.svg', 5)
  var bananna0 = new Actor(ctx, './images/bananna.svg', 5)
  var flip = false
  var x = 500
  var y = 400
  loopBuddy(() => {
    rotate += 5
    if(rotate % 10 === 0)
    {
      rotate *= -1
      ctx.resetTransform()
      ctx.clearRect(0, 0, 10000, 10000);
    }

    bananna0.draw(300, 200, 3, 30*rotate)

    var bananna1 = new Actor(ctx, './images/bananna.svg', 5)
    bananna1.draw(400, 50, 4, -30*rotate)

    var bananna2 = new Actor(ctx, './images/bananna.svg', 5)
    bananna2.draw(600, 400, 2, 70*rotate)

    var bananna22 = new Actor(ctx, './images/bananna.svg', 5)
    bananna22.draw(400, 400, 2, 70*rotate)

    ctx.resetTransform();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,'+Math.random()+')';
    if(flip)
    {
      if(Math.floor(x) % 2 === 0)
          x -= 300 * Math.random()
      else
          x += 301 * Math.random()
    }
    else
      y += 200 * Math.random()  * -1*(Math.floor(y) % 2)
    flip = !flip
    ctx.arc(x, y, 200, 0, Math.PI * 2, true); // Outer circle
    ctx.arc(x*1.8, y*1.8, Math.abs(y/10), 0, Math.PI * 2, true); // Outer circle
    ctx.arc(x, y*1.8, Math.abs(x), 0, Math.PI * 2, true); // Outer circle
    ctx.fill();

    var bananna3 = new Actor(ctx, './images/bananna.svg', 5)
    bananna3.draw(800, 700, 5, 120*rotate)

    var bananna4 = new Actor(ctx, './images/bananna.svg', 5)
    bananna4.draw(600, 800, 3, -30*rotate)

    milkboy.draw(milkboy.posX, milkboy.posY)

  }, 14000, 600)

  milkboy.dark = true
  await wait(1000)
  await milkboy.say("WOW! A BANANNA PARTY!", 35, 450, 100)
  await wait(500)
  $('.message').remove()
  await milkboy.say("IT'S .... (つ°ヮ°)つ ....", 35, 450, 100)
  await loopBuddy(() => {
    milkboy.clearOnDraw = true
    ctx.resetTransform();
    milkboy.draw(milkboy.posX, milkboy.posY)
    milkboy.mutate(banannafo)
  }, 2000, 100)
  milkboy.say("BANANNA TIME!", 35, 500, 100)
  await loopBuddy(() => {
    rotate += 5
    if(rotate % 10 === 0)
    {
      rotate *= -1
      ctx.resetTransform()
    }
    milkboy.draw(milkboy.posX, milkboy.posY, 1, 30*rotate)
  }, 4000, 200)
  $('.message').remove()
  bananna0.dark = true
  await bananna0.say("DUDE (∩O□O∩) !!!", 300, 200, 100)
  await wait(500)
  await bananna0.say("YOU'RE RUINING THE VIBE", 300, 300, 80)
  await wait(800)
  $('.message').remove()
  await bananna0.say("ARE YOU TRYING TO BE A BANANNA?", 300, 200, 40)
  await wait(500)
  await bananna0.say("THAT'S PRETTY INSULTING TO OUR CULTURE", 250, 280, 40)
  await wait(500)
  await milkboy.say("OH", 35, 450, 100)
  await loopBuddy(() => {
    milkboy.clearOnDraw = true
    ctx.resetTransform();
    milkboy.draw(milkboy.posX, milkboy.posY)
    milkboy.mutate(milkboy_orig)
  }, 4000, 100)
  milkboy.oDOM = milkboy_orig.oDOM
  milkboy.loop = true
  milkboy.draw(milkboy.posX, milkboy.posY)
  $('.message').remove()
  await milkboy.say("I'M SORRY YOU GUYS", 35, 450, 200)
  milkboy.say("... I'LL BE GOING NOW ... ... ... ... ... ...", 35, 510, 200)
  await loopBuddy(() => {
    milkboy.clearOnDraw = false
    ctx.resetTransform();
    milkboy.draw(milkboy.posX + 10, milkboy.posY)
  }, 10000, 100)
  milkboy.loop = false
  milkboy.run = false
  $('body').removeClass('bananna')
  $('body').addClass('black')
  ctx.resetTransform()
  ctx.clearRect(0, 0, 10000, 10000)
  await wait(1000)
  $('.message').remove()
}


//momSequence()
titleSequence()
//darkSequence()
//yellowSequence()


/*var milkboy = new Actor(ctx, './images/test_1.svg')
var mom = new Actor(ctx, './images/test.svg')
stationaryLoop(mom, milkboy)
wait(500)
mom.warning("MOM", 25, 170)
wait(500)
mom.message("HELLO MILK BOY", 25, 270)*/
