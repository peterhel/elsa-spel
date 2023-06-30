function equals(arr1, arr2) {
  for (let i = 0; i < 3; i++) if (arr1[i] !== arr2[i]) return false;

  return true;
}

function arrayToInt(data /*[]*/) {
  let startIndex = 0;
  let value = data[startIndex];

  for (let i = 1; i < data.length; i++) {
    value <<= 8;
    value |= data[i + startIndex];
  }

  return value >>> 0;
}

const ladderMask = 0xff000000;
const groundMask = 0xffff0000;
const opacityMask = 0x000000ff;

class Hero {
  images = {};

  constructor() {
    let drawing = new Image();
    drawing.src = "res/unicorn.png";
    let imgFlip = new Image();
    imgFlip.src = "res/unicorn_flip.png";


    let load1 = new Promise((resolve) => {
      drawing.onload = () => {
        this.images[1] = drawing;

        resolve();
      };
    });

    let load2 = new Promise((resolve) => {
      imgFlip.onload = () => {
        this.images[-1] = imgFlip;

        resolve();
      };
    });

    Promise.all([load1, load2]).then(() => {
      if (this.onload) {
        this.onload = this.onload.bind(this);
        this.onload();
      }
    });
  }

  onload = null;
  get height() {
    return this.drawing.height;
  }

  

  render(ctx, env) {
    let movementChange = env.movementSpec;
    let horizontalPolarity = movementChange[0] / Math.abs(movementChange[0]);
    if(isNaN(horizontalPolarity)) {
        horizontalPolarity = env.lastPolarity.get(lp);
    }

    env.lastPolarity.set(lp, horizontalPolarity)

    let drawing = this.images[horizontalPolarity]

    let pxHeroCenter = env.elsaPos[0] + drawing.width / 2;
    let pxHeroBottom = env.elsaPos[1] + drawing.height;

    let i = 0;

    if (movementChange[1] !== 0) {
      //If moving up or down
      let pm = movementChange[1] / Math.abs(movementChange[1]);

      let feetZone = arrayToInt(
        ctx.getImageData(pxHeroCenter, pxHeroBottom + 1 * pm, 1, 1).data
      );

      while ((feetZone & ladderMask) >>> 0 > 0) {
        i = i + 1;
        feetZone = arrayToInt(
          ctx.getImageData(pxHeroCenter, pxHeroBottom + (i + 1) * pm, 1, 1).data
        );

        if (i >= env.stepLength) {
          break;
        }
      }
      env.elsaPos[1] += i * pm;
    }

    let j = 0;
    // let pxCurrent = arrayToInt(
    //   ctx.getImageData(pxHeroCenter, pxHeroBottom + j, 1, 1).data
    // );
    // let groundValue = (pxCurrent & groundMask) >>> 0;

    let [r1, atFeet, , , r2, belowFeet] = ctx.getImageData(
      pxHeroCenter,
      pxHeroBottom - 1,
      1,
      2
    ).data;
    let freeFall = arrayToInt([r1, atFeet, r2, belowFeet]);
    // console.log(freeFall)

    //while (freeFall !== 65280 && freeFall !== 4278255360) {
    while (freeFall === 0 || freeFall === 16711935 || freeFall === 16711680) {
      //   console.log("falling");
      j++;
      let [, atFeet, , , , belowFeet] = ctx.getImageData(
        pxHeroCenter,
        pxHeroBottom - 1 + j,
        1,
        2
      ).data;
      freeFall = arrayToInt([atFeet, belowFeet]);
      if (j > env.stepLength) break;
    }

    env.elsaPos[1] += j;

    if (movementChange) {
      env.elsaPos[0] += movementChange[0];
    }

    if (env.elsaPos[0] + drawing.width > env.canvas.width) {
      elsaPos[0] = env.canvas.width - drawing.width;
    } else {
    }

    if (env.elsaPos[0] < 0) {
      env.elsaPos[0] = 0;
    }

    ctx.drawImage(
      drawing,
      env.elsaPos[0],
      env.elsaPos[1]
    );
  }
}


