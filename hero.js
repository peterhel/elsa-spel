function equals(arr1, arr2) {
    for(let i=0;i<3;i++) 
        if(arr1[i] !== arr2[i])
            return false;
    
    return true
}

const ladderTmpl = Uint8Array.from([255,0,0]);
const freeFallTmpl = Uint8Array.from([0,0,0]);

class Hero {
    constructor() {
        this.drawing = new Image();
        this.drawing.src = 'res/elsa.png';
        this.drawing.onload = () => {
            if(this.onload) {
                this.onload = this.onload.bind(this)
                this.onload();
            }
        };
    }

    onload = null;
    get height () {
        return this.drawing.height
    }

    render(ctx, env) {
        let movementChange = env.movementSpec;

        let pxHeroCenter =env.elsaPos[0] + (this.drawing.width/2);
        let pxHeroBottom = env.elsaPos[1] + this.drawing.height

        let pixelAtFeet = ctx.getImageData(pxHeroCenter, pxHeroBottom, 1, 1).data;
        // let pixelBelowFeet = ctx.getImageData(pxHeroCenter, pxHeroBottom + 1, 1, 1).data;

        let i = 0;
        let pxCurrent = ctx.getImageData(pxHeroCenter, pxHeroBottom+i, 1, 1).data;

        console.log('movement',movementChange[0])
        if(movementChange[1] !== 0){
            let pm = movementChange[1] / Math.abs(movementChange[1])
            while(equals(pxCurrent, ladderTmpl))
            {
                i+=1*pm
                console.log('At ladder. Eg accept up/downwards movement')
                pxCurrent = ctx.getImageData(pxHeroCenter, pxHeroBottom+Math.abs(i)+1, 1, 1).data;
                // debugger
                if(Math.abs(i) > Math.abs(env.stepLength))
                    break;
                console.log(i, env.elsaPos[1], pxCurrent)
            }
            
        }
        
        env.elsaPos[1] += i// + movementJump[1];

        if(i === 0) {
            pxCurrent = ctx.getImageData(pxHeroCenter, pxHeroBottom+i, 1, 1).data;
            
            while(equals(pxCurrent, freeFallTmpl)) {
                i++;
                console.log(i, 'not solid')
                pxCurrent = ctx.getImageData(pxHeroCenter, pxHeroBottom+i, 1, 1).data;
                if(i > env.stepLength)
                    break;
                console.log(i, env.elsaPos[1], pxCurrent)
            }

        }
    
            env.elsaPos[1] += i
        

    // movementJump[1]= 10

        console.log(pixelAtFeet)        

        if (movementChange) {
          env.elsaPos[0] += movementChange[0]// + movementJump[0];
        }
  
        if (env.elsaPos[0]+this.drawing.width > env.canvas.width) {
            elsaPos[0] = env.canvas.width-this.drawing.width
            }else {
                    // env.elsaPos[0] -= movementChange[0];
            // env.viewportPos[0] += movementChange[0];
          }
        
  
        if (env.elsaPos[0] < 0) {
        //   if (env.viewportPos[0] < 1) {
            env.elsaPos[0] = 0;
            // env.viewportPos[0] = 0;
        //   } else {
            // env.elsaPos[0] -= movementChange[0];
            // env.viewportPos[0] += movementChange[0];
        //   }
        }
  
        ctx.drawImage(this.drawing, env.elsaPos[0], env.elsaPos[1]);
      }
}