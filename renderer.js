importScripts('hero.js'); 
importScripts('shot.js'); 

async function importImage(url){
    let imgMonsterResponse = await fetch(url);
    let imageMonsterBlob = await imgMonsterResponse.blob();
    return await createImageBitmap(imageMonsterBlob);
}
var ctx;
let stepLength = 5;
let movements = [];
let movementSpec = [0, 0];
var lastPolarity = 1
let elsaPos = [0, 0];
let renderActions = [renderFPS];
let viewportPos = [0, 0];

function shoot() {
    let shot = new Shot({elsaPos, lastPolarity}).shoot(() => {
        renderActions.splice(renderActions.indexOf(shot), 1);
      });
      renderActions.push(shot);
}

function moveUp(multiplier = 1) {
    movementSpec[1] = (stepLength * -1) * multiplier

  }
  function moveDown(multiplier = 1) {
    movementSpec[1]=stepLength * multiplier

  }
  function moveLeft(multiplier = 1) {
    movementSpec[0] = (stepLength*-1) * multiplier;

  }
  function moveRight(multiplier = 1) {
    movementSpec[0] = stepLength * multiplier;

  }


  let lastFrame = performance.now();

  let framelag = 0;
  let framesRendered = 0;

  function renderFPS() {
    framesRendered++;

    let thisFrame = performance.now();
    if (framelag === 0) {
      framelag = thisFrame - lastFrame;
    } else {
      framelag = (framelag + (thisFrame - lastFrame)) / 2;
    }
    let framesPerSec = Math.round(1000 / framelag);

    lastFrame = performance.now();

    ctx.fillText(
      `${framesPerSec}, Elsa: ${elsaPos}, Viewport: ${viewportPos}`,
      10,
      50
    );
  }


async function init([canvas]) {
    // self.postMessage(e.data);
     ctx = canvas.getContext("2d");

    ctx.font = "20px Georgia";
    ctx.fillText("Hello World!", 10, 50);

    function renderMonster() {
        ctx.drawImage(
          imgMonster,
          40,
          120,
        );
      }
    
      function renderLevel() {
        ctx.drawImage(
          imgLevel,
          viewportPos[0],
          viewportPos[1],
          640,
          480,
          0,
          0,
          640,
          480
        );
      }
    
    let moveBgLeft = false;
    let moveBgRight = false;

    
    let lastPolarity = 1;
    let hero = new Hero();

    hero.onload = () => {
      renderActions.push(() => hero.render(ctx, {elsaPos,lastPolarity, viewportPos, canvas, movements, movementSpec, stepLength}))
      elsaPos[0] = 40;
      elsaPos[1] = 0// canvas.height - (hero.height + 50)
    }

    const imgMonster = await importImage('res/monster.png');
    renderActions.unshift(renderMonster);
    
    imgLevel = await importImage('res/bana1.png')
    renderActions.unshift(renderLevel);

    imgSnowflake = await importImage('res/snowflake.png')



    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let action of renderActions) {
        action(ctx);
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function stopMoveH() {
    movementSpec[0] = 0;

}

function stopMoveV() {
    movementSpec[1] = 0;
    
}

const actions = {
    init,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    shoot,
    stopMoveH,
    stopMoveV,
}

self.addEventListener('message', async function(e) {

    const { action, args } = e.data;
    actions[action].call(self, args)


  }, false);