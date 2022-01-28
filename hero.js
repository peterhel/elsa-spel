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

        var pixelAtFeet = ctx.getImageData(env.elsaPos[0] + (this.drawing.width/2), env.elsaPos[1] + this.drawing.height, 1, 1).data;
        var pixelBelowFeet = ctx.getImageData(env.elsaPos[0] + (this.drawing.width/2), env.elsaPos[1] + this.drawing.height + 1, 1, 1).data;
        
        if(pixelAtFeet[0] === 255) {
            console.log('at ladder')
            env.elsaPos[1] += movementChange[1]// + movementJump[1];
        }


        // let movementJump = env.movements.shift() || [0,0];
        if ( pixelBelowFeet.slice(0,3).some(x => x === 255)) {
            // allow climb
            // if(movementJump[1] > 0 ) {
                // env.movements =[]
                // console.log(pixelBelowFeet.join(','), ' solid')
                // movementJump = [0,0]
            // }
            // env.elsaPos[1] += movementChange[1]// + movementJump[1];
            }
 else {
    env.elsaPos[1] += 1
    // movementJump[1]= 10
        }

        

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