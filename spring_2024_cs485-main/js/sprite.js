class BackgroundSprite {
  constructor(sprite_json, state) {
    this.sprite_json = sprite_json;
    this.state = state;

    this.root_e = "acid_bk";
    this.cur_frame = 0;
    this.x = 0;
    this.y = 0;
  }
  draw(state) {
    var ctx = canvas.getContext("2d");
    if (
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"] == null
    ) {
      console.log("loading Bk");
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"] =
        new Image();
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"].src =
        "acid_bk/" +
        this.root_e +
        "/" +
        this.state +
        "/" +
        this.cur_frame +
        ".png";
    }

    console.log(
      this.state +
        " " +
        this.cur_frame +
        " " +
        this.sprite_json[this.root_e][this.state].length
    );
    ctx.drawImage(
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"],
      this.x,
      this.y,
      window.innerWidth,
      window.innerHeight
    );

    this.cur_frame = this.cur_frame + 1;
    if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
      this.cur_frame = 0;
    }

    return true;
  }
}

//Parent Sprit Classa
class Sprite {
  constructor(sprite_json, x, y, start_state, color) {
    this.sprite_json = sprite_json;
    this.x = x;
    this.y = y;
    this.state = start_state;
    this.root_e = "TenderBud";
    this.color = color;
    this.cur_frame = 0;

    this.cur_bk_data = null;

    this.x_v = 0;
    this.y_v = 0;
  }

  draw(state) {
    var ctx = canvas.getContext("2d");
    //console.log(this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);
    console.log(state["key_change"]);

    if (
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"] == null
    ) {
      console.log("loading");
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"] =
        new Image();
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"].src =
        "Penguins/" +
        this.root_e +
        "/" +
        this.state +
        "/" +
        this.cur_frame +
        ".png";
    }

    if (this.cur_bk_data != null && state["has_background_changed"] == false) {
      ctx.putImageData(this.cur_bk_data, this.x - this.x_v, this.y - this.y_v);
    }

    this.cur_bk_data = ctx.getImageData(
      this.x,
      this.y,
      this.sprite_json[this.root_e][this.state][this.cur_frame]["w"],
      this.sprite_json[this.root_e][this.state][this.cur_frame]["h"]
    );

    ctx.drawImage(
      this.sprite_json[this.root_e][this.state][this.cur_frame]["img"],
      this.x,
      this.y
    );
    if (this.state == "walk_N") {
      ctx.beginPath();
      ctx.arc(this.x + 85, this.y - 35, 20, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    } else if (this.state == "walk_S") {
      ctx.beginPath();
      ctx.arc(this.x + 85, this.y - 35, 20, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    } else if (this.state == "walk_E") {
      ctx.beginPath();
      ctx.arc(this.x + 60, this.y - 35, 20, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x + 85, this.y - 35, 20, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }

    this.cur_frame = this.cur_frame + 1;
    if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
      console.log(this.cur_frame);
      this.cur_frame = 0;
    }

    var map_context = offscreen.getContext("2d");
    var data = map_context.getImageData(
      this.x + this.sprite_json[this.root_e][this.state][this.cur_frame]["w"],
      this.y,
      1,
      1
    ).data;
    var rgb = [data[0], data[1], data[2]];

    console.log(rgb);
    if (data[0] == 255 && data[1] == 0 && data[2] == 0) {
      this.bound_hit("F");
    } else if (
      this.x >=
      window.innerWidth -
        this.sprite_json[this.root_e][this.state][this.cur_frame]["w"]
    ) {
      this.bound_hit("E");
      changeBk("right");
      this.x = this.x - 1;
      // sprites_to_draw[0].push( new BackgroundSprite(data) );
    } else if (this.x <= 0) {
      this.bound_hit("W");
      changeBk("left");
      this.x = this.x + 1;
      // sprites_to_draw[0].push( new BackgroundSprite(data) );
    } else if (
      this.y >=
      window.innerHeight -
        this.sprite_json[this.root_e][this.state][this.cur_frame]["h"]
    ) {
      this.bound_hit("S");
      this.y = this.y - 1;
      changeBk("default");
    } else if (this.y <= 0) {
      this.bound_hit("N");
      this.y = this.y + 1;
      changeBk("top");
    } else {
      this.x = this.x + this.x_v;
      this.y = this.y + this.y_v;
    }

    return false;
  }

  set_idle_state() {
    this.x_v = 0;
    this.y_v = 0;
    const idle_state = [
      "idle",
      "idleBackAndForth",
      "idleBreathing",
      "idleFall",
      "idleLayDown",
      "idleLookAround",
      "idleLookDown",
      "idleLookLeft",
      "idleLookRight",
      "idleLookUp",
      "idleSit",
      "idleSpin",
      "idleWave",
    ];

    //const random = Math.floor(Math.random() * idle_state.length);
    //console.log(idle_state[random]);
    this.state = "idle"; // idle_state[random];
  }

  bound_hit(side) {
    console.log(side);
    this.set_idle_state();
  }
}
