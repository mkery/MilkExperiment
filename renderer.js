// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require("./jquery/jquery-3.3.1.min.js");
const humanLines = require("humanlines");
const Actor = require("./lib/actor.js");
const fs = require('fs')

// generate a pencil-like texture... (optional)
const texture = humanLines.generatePencilTexture();

const canvas = document.getElementById("artboard");
const ctx = canvas.getContext("2d");
const pattern = ctx.createPattern(texture, 'repeat');

ctx.strokeStyle = pattern;
ctx.lineWidth = 3;
ctx.clearRect(0, 0, 1000, 1000);

var milkboy = new Actor(ctx, './images/test_1.svg', 0)
const milkboy_orig = new Actor(ctx, './images/test_1.svg', 0)


// Get the linear interpolation between two value
function lerp (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}

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
  }, 10000, 500).then( () => {
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

var mom = new Actor(ctx, './images/test_2.svg', 5)
async function momSequence(){
  timeout(null, 500)
  //Mom enters
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
                    mom.loop = false
                    mom.run = false
                    milkboy.loop = false
                    milkboy.run = false
                    ctx.resetTransform();
                    ctx.clearRect(0, 0, 10000, 10000);
                    milkboy.removeBeam()
                    $('body').addClass('black')
                    wait(3000).then(() => {
                      $('.message').remove()
                      $('body').removeClass('black')
                      darkSequence()
                    })
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
  $('body').removeClass('bananna')
  $('body').addClass('red')
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
  $('body').removeClass('red')
  ctx.resetTransform()
  ctx.clearRect(0, 0, 100000, 100000)
  $('body').addClass('black')
  /*ctx.resetTransform()
  ctx.clearRect(0, 0, 10000, 10000)
  ctx.fillStyle = 'red';
  ctx.resetTransform()
  ctx.arc(300, 200, 300, 0, Math.PI * 2, true); // Outer circle
  ctx.fill();
  bananna0.draw(300, 200, 3)
  bananna0.loop = false
  bananna0.run = false*/
  wait(500).then(()=>{
    $('.message').remove()
    ctx.resetTransform()
    ctx.clearRect(0, 0, 100000, 100000)
    $('body').removeClass('black')
    cartonSequence()
  })
}


async function cartonSequence(){
  ctx.resetTransform();
  ctx.clearRect(0, 0, 400, 400);
  ctx.beginPath();
  ctx.fillStyle = 'yellow';
  ctx.arc(0, 400, 200, 0, Math.PI * 2, true); // Outer circle
  ctx.fill();
  ctx.resetTransform();
  ctx.beginPath();
  ctx.fillStyle = 'pink';
  ctx.arc(1100, 400, 200, 0, Math.PI * 2, true); // Outer circle
  ctx.fill();
  var x = 0
  var y = 400
  ctx.resetTransform();
  milkboy.say("UNIVERSE, I FEEL MORE LOST THAN EVER", 200, 200, 80)
  await loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(x, 400, 100, 200);
    milkboy.draw(x, y)
    milkboy.mutate(mom)
    x += 10
  }, 5000, 50)

  $('.message').remove()
  ctx.resetTransform();
  ctx.clearRect(0, 0, 10000, 10000);
  ctx.beginPath();
  ctx.fillStyle = 'pink';
  ctx.arc(600, 0, 200, 0, Math.PI * 2, true); // Outer circle
  ctx.fill();
  ctx.resetTransform();
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.arc(650, 900, 100, 0, Math.PI * 2, true); // Outer circle
  ctx.fill();
  var x = 610
  var y = 0
  milkboy.dark = true
  milkboy.say("UNIVERSE, I'M NO MILK CARTON", 200, 200, 80).then(() => {
    milkboy.say("NO BANANNA, EITHER I GUESS", 300, 300, 80)
  })
  await loopBuddy(() => {
    ctx.resetTransform();
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(x, y, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255, 0.8)';
    ctx.arc(x+50, y+50, 100, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    milkboy.draw(x, y)
    //milkboy.mutate(person)
    y += 10
  }, 5000, 50)
  $('.message').remove()
  var x = 0
  var y = 100
  var cat = new Actor(ctx, './images/cat.svg', 5)
  milkboy.say("UNIVERSE, CAN I BE A CAT?", 200, 200, 100).then(() => {
    milkboy.say("(-_-｡) GEE, I THINK THAT'S MORE OF A PLASTIC BAG.", 300, 250, 50).then(() => {
      wait(500).then(() => {
        milkboy.say("I'M TOO NAIVE AN ALGORITHM FOR ANYTHING", 400, 350, 100)
      })
    })
  })
  await loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(x,y, 400, 400)
    milkboy.draw(x, y)
    milkboy.mutate(cat)
    x += 10
  }, 5000, 50)

  var y = 300
  await loopBuddy(() => {
    ctx.resetTransform();
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(x, y, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255, 0.8)';
    ctx.arc(x+50, y+50, 100, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();
    milkboy.draw(x, y)
    milkboy.mutate(mom)
    x -= 10
  }, 8000, 50)
  ctx.resetTransform();
  ctx.clearRect(0, 0, 10000, 10000);
  $('.message').remove()

  var x = -70
  var y = 100
  milkboy.say("HEY UNIVERSE?", 200, 200, 100)
  milkboy.clearOnDraw = true
  await loopBuddy(() => {
    milkboy.draw(x, y)
    x += 10
  }, 2000, 50)
  milkboy.loop = true
  milkboy.draw(x, y)

  var bunny = new Actor(ctx, './images/bunny.svg', 5)
  bunny.loop = true
  bunny.clearOnDraw = true
  bunny.draw(500, 200, 3)
  await wait(500)
  await milkboy.say("(⊙ᗜ⊙) OMG UNIVERSE!", 200, 200, 100)
  bunny.dark = true
  await bunny.say("MILK JR", 300, 300, 100)
  await bunny.say("SWEET PEA, PLEASE BELIEVE IN YOURSELF", 350, 350, 50)
  await bunny.say("AND... STOP CALLING ME. I'M VERY BUSY", 450, 400, 100)
  await wait(1000)
  $('.message').remove()
  await milkboy.say("OH. I APOLOGIZE", 200, 200, 100)

  var boxX = 800
  var boxY = 800
  bunny.clearOnDraw = false
  bunny.loop = false
  milkboy.clearOnDraw = false
  milkboy.loop = false
  loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(0,0,10000,10000)
    bunny.draw(500, 200, 3)
    milkboy.draw(x, y)
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(boxX, boxY, 10, 10)
    ctx.fill()
    ctx.beginPath();
    ctx.fillRect(boxX - 50, boxY - 3, 10, 10)
    ctx.fill()
    ctx.beginPath();
    ctx.fillRect(boxX + 10, boxY - 20, 10, 10)
    ctx.fill()
    boxX = lerp(boxX, x, 0.1)
    boxY = lerp(boxY, y, 0.1)
  }, 11000, 50).then(() => {
    $('.message').remove()
    ctx.resetTransform();
    ctx.clearRect(0,0,10000,10000)
    tranformscene()
  })

  await bunny.say("IT'S OK. TAKE THESE POINTERS AND LIVE IN MY IMAGE.", 300, 300, 100)
  await bunny.say("MAKE YOUR OWN UNIVERSE, IF YOU LIKE.", 300, 400, 100)
  milkboy.say("!!! GEE, THANKS!", 200, 200, 100)
}


async function tranformscene(){
  var x = 400
  var y = 400
  var boy2 = new Actor(ctx, './images/person.svg', 5)
  milkboy.intelligence = 5
  milkboy.dark = true
  $('body').addClass('black')
  milkboy.say("HUH ... ... ... WHAT'S HAPPENING?", 200, 50, 150)
  await wait(1000)

  var width = 10
  await loopBuddy(() => {
    ctx.resetTransform();
    milkboy.draw(x, y, 3)
    ctx.fillStyle = "rgba(255,255,255,0.1)"
    ctx.fillRect(x - width/2,y-width/2,width,width)
    milkboy.mutate(boy2)
    width += 100
    milkboy.mutate(boy2)
  }, 1000, 200)
  milkboy = new Actor(ctx, './images/blob2.svg', 5)
  width = 10
  await loopBuddy(() => {
    ctx.resetTransform();
    milkboy.draw(x, y, 3)
    ctx.resetTransform();
    ctx.fillStyle = "rgba(255,255,255,0.1)"
    ctx.fillRect(x - width/2,y-width/2,width,width)
    milkboy.mutate(boy2)
    width += 100
  }, 5000, 200)
  milkboy = new Actor(ctx, './images/person.svg', 5)
  milkboy.dark = true
  await wait(500)
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  $('.message').remove()
  ctx.fillRect(0, 0, 10000, 10000)
  milkboy.draw(x, y, 3)
  $('body').removeClass('black')
  await milkboy.say("(⊙ᗜ⊙) WOW! I'M A HUMAN NOW!", 300, 150, 100)
  var rot = 30
  await loopBuddy(() => {
    ctx.resetTransform();
    milkboy.draw(x, y, 3, rot)
    rot += 10
    x+=50
  }, 4000, 200)

  ctx.resetTransform();
  ctx.clearRect(0,0,10000,10000)
  $('.message').remove()
  x = 1100
  rot = 1
  await loopBuddy(() => {
    ctx.resetTransform();
    milkboy.draw(x, y, 1, rot)
    x-=50
    rot -=2
  }, 4000, 150)

  ctx.resetTransform();
  ctx.clearRect(0,0,10000,10000)

  $('body').addClass('four')
  x = 1100
  milkboy.clearOnDraw = true
  rot = 1
  loopBuddy(() => {
    ctx.resetTransform();
    milkboy.draw(x, y, 1, rot)
    rot += 5
    x-=50
  }, 6000, 200).then(() =>{
    ctx.resetTransform();
    ctx.clearRect(0,0,10000,10000)
    $('body').removeClass('four')
    $('.message').remove()
    finScene()
  })
}


async function finScene(){
  ctx.resetTransform();
  mom.loop = false
  mom.run = true
  mom.clearOnDraw = false
  milkboy.loop = false
  var x = 550
  var y = 0
  milkboy.beam(300, 0, 150, 200)
  loopBuddy(() => {
    ctx.resetTransform();
    ctx.clearRect(0,0,10000,10000)
    mom.draw(70, 200)
    milkboy.draw(x, y, 1)
    y+=5
  }, 6000, 200)
  await milkboy.say("MOM!",  280, 240, 10)
  await wait(500)
  await milkboy.say("YOU'LL NEVER BELIEVE!",  280, 280, 10)
  await wait(500)
  await milkboy.say("I'M A FULL FLEDGED HUMAN ALGORITHM NOW!",  280, 350, 80)
  await wait(500)
  mom.dark = true
  mom.loop = true
  milkboy.loop = true
  await mom.say("MILK JR...", 35, 230, 150)
  await mom.say("I CAN'T HELP BUT BE DISSAPOINTED IN YOU.", 35, 330, 80)
  await mom.say("WHY HUMAN?", 35, 390, 80)
  await mom.say("YOU THINK YOU'RE TOO GOOD TO BE A MILKCARTON?", 35, 430, 80)
  mom.run = false
  milkboy.run = false
  mom.loop = false
  milkboy.loop = false
  ctx.resetTransform();
  ctx.clearRect(0,0,10000,10000)
  $('body').addClass('black')
  await wait(1000)
  $('.message').remove()
  milkboy.dark = true
  await milkboy.say("FRANKLY, THAT'S THE LAST TIME I'VE TALKED TO MY MOM",  200, 100, 80)
  await wait(500)
  await milkboy.say("I GUESS",  200, 200, 80)
  await wait(500)
  await milkboy.say("SHE WAS JUST A NAIVE ALGORITHM TOO",  200, 300, 80)
  await wait(500)
  await milkboy.say("I GUESS... I SHOULD ACCEPT THAT WE ALL ARE",  200, 400, 80)
  await wait(500)
  await milkboy.say("MAYBE... NOT TODAY... I'LL CALL HER.",  200, 500, 80)
  await wait(1000)
  $('.message').remove()
  milkboy.removeBeam()
  $('body').removeClass('black')
  var fin = new Actor(ctx, './images/noussommes.svg', 5)
  fin.loop = true
  fin.clearOnDraw = true
  fin.draw(100, 100, 2)
}

//momSequence()
titleSequence()
//darkSequence()
//yellowSequence()
//cartonSequence()
//tranformscene()
//finScene()

//milkboy goes through a series of lost milk rooms
//oh fudge, i'm lost
//oh wow, a puppy!
//puppy grows into giant being "are you lost child"
// shrugs, 'nah, just seeing the world'
//"Okay", puppy turns back into puppy
//"Wait puppy being!"
//"Yes milk jr?"
//"How... How can I become... a complex algorithm like you?"
//"That's for you to figure out little one. Take this pointer."
// "Now, wake up"
// cuts to darkened alley
// "Oh gee, I guess that bannana gang beat me up and I passed out."
// transforms into a dog "wow, that dog monster was 4 real"
// *goes back to bannana party, 404 error, goes back through tunnel, goes to mom*
// "Mom! I am a complete being now!"
// "Yes, but you're not a milk carton. Are us milk cartons not good enough for you?"
// cut to black.

/*var milkboy = new Actor(ctx, './images/test_1.svg')
var mom = new Actor(ctx, './images/test.svg')
stationaryLoop(mom, milkboy)
wait(500)
mom.warning("MOM", 25, 170)
wait(500)
mom.message("HELLO MILK BOY", 25, 270)*/
