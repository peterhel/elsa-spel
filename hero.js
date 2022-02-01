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
  constructor() {
    this.drawing = new Image();
    this.drawing.src = "res/elsa.png";
    this.drawing.onload = () => {
      if (this.onload) {
        this.onload = this.onload.bind(this);
        this.onload();
      }
    };
  }

  onload = null;
  get height() {
    return this.drawing.height;
  }

  render(ctx, env) {
    let movementChange = env.movementSpec;

    let pxHeroCenter = env.elsaPos[0] + this.drawing.width / 2;
    let pxHeroBottom = env.elsaPos[1] + this.drawing.height;

    let i = 0;

    if (movementChange[1] !== 0) {
      let pm = movementChange[1] / Math.abs(movementChange[1]);
      console.log(movementChange, pm > 0 ? "down" : "up");

      let feetZone = [
        arrayToInt(
          ctx.getImageData(pxHeroCenter, pxHeroBottom + 1 * pm, 1, 1).data
        ),
      ];
      while (feetZone.some((x) => (x & ladderMask) >>> 0 > 0)) {
        i = i + 1;
        console.log(
          "At ladder. Eg accept up/downwards movement. i: ",
          i,
          env.stepLength
        );
        feetZone = [
          arrayToInt(
            ctx.getImageData(pxHeroCenter, pxHeroBottom + (i + 1) * pm, 1, 1)
              .data
          ),
        ];
        if (i >= env.stepLength) {
          console.log("reached stepLength");
          break;
        }
      }
      console.log("before", env.elsaPos[1]);
      env.elsaPos[1] += i * pm;
      console.log("asfter", env.elsaPos[1]);
    }

    let j = 0;
    let pxCurrent = arrayToInt(
      ctx.getImageData(pxHeroCenter, pxHeroBottom + j, 1, 1).data
    );
    let groundValue = (pxCurrent & groundMask) >>> 0;
    while (groundValue === 0) {
      console.log("falling");
      j++;
      pxCurrent = arrayToInt(
        ctx.getImageData(pxHeroCenter, pxHeroBottom + j, 1, 1).data
      );
      groundValue = (pxCurrent & groundMask) >>> 0;
      if (j > env.stepLength) break;
    }

    env.elsaPos[1] += j;

    if (movementChange) {
      env.elsaPos[0] += movementChange[0];
    }

    if (env.elsaPos[0] + this.drawing.width > env.canvas.width) {
      elsaPos[0] = env.canvas.width - this.drawing.width;
    } else {
    }

    if (env.elsaPos[0] < 0) {
      env.elsaPos[0] = 0;
    }

    ctx.drawImage(this.drawing, env.elsaPos[0], env.elsaPos[1]);
  }
}
