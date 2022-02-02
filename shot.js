class Shot {
    startPos;
    dd;
    snoflakePos = [0, 0];
    snowflakeMovements = [];
    direction = 1;

    constructor({elsaPos:startPos, lastPolarity}) {
      this.startPos = startPos;
      this.direction = lastPolarity;
    }

    shoot(done) {
      this.snowflakePos = [this.startPos[0] + 6 +(25*this.direction), this.startPos[1] + 20];
      for (let i = 0; i < 80; i++) {
        this.snowflakeMovements.push([i, 0]);
      }

      setTimeout(() => {
        this.snowflakeMovements = [];
        done();
      }, 1000);

      return this.renderSnowflake.bind(this);
    }
    renderSnowflake(ctx) {
      let movementChange = this.snowflakeMovements.shift();
      if (movementChange) {
        this.snowflakePos[0] += movementChange[0] * this.direction;
        this.snowflakePos[1] += movementChange[1];
      }

      ctx.drawImage(imgSnowflake, this.snowflakePos[0], this.snowflakePos[1]);
    }
  }