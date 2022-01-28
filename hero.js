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

        var c = ctx.getImageData(env.elsaPos[0], env.elsaPos[1], 1, 1).data;
          
        console.log(c.join(','))

        let movementJump = env.movements.shift() || [0, 0];

        let movementChange = env.movementSpec;
        if (movementChange) {
          env.elsaPos[0] += movementChange[0] + movementJump[0];
          env.elsaPos[1] += movementChange[1] + movementJump[1];
        }
  
        if (env.elsaPos[0] > env.canvas.width / 2) {
          if(env.viewportPos[0] > 6400-641) {
            env.elsaPos[0] = env.canvas.width / 2;
            env.viewportPos[0] = 6400-640;
  
          }else {
            env.elsaPos[0] -= movementChange[0];
            env.viewportPos[0] += movementChange[0];
          }
        }
  
        if (env.elsaPos[0] < 0) {
          if (env.viewportPos[0] < 1) {
            env.elsaPos[0] = 0;
            env.viewportPos[0] = 0;
          } else {
            env.elsaPos[0] -= movementChange[0];
            env.viewportPos[0] += movementChange[0];
          }
        }
  
        ctx.drawImage(this.drawing, env.elsaPos[0], env.elsaPos[1]);
      }
}