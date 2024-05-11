const up_arrow = 38;
const down_arrow = 40;
const left_arrow = 37;
const right_arrow = 39;
const enter_key = 13;
const w_key = 87;
const a_key = 65;
const s_key = 83;
const d_key = 68;
const space = 32;
const flock = [];
const canvas = document.querySelector("canvas");

const offscreen = new OffscreenCanvas(256, 256);
const sprites_to_draw = new Array(2);
var draw_loop_timeout;
var img = new Image();
var color_map = new Image();
var reset = false;
sprites_to_draw[0] = new Array(0); //background and
sprites_to_draw[1] = new Array(0); //forground
let img1;

function preload() {
  img1 = loadImage("imgs/snowball.png");
}
function setup() {
  createCanvas(1920, 1080);
  alignSlider = createSlider(0, 2, 1.5, 0.1);
  alignSlider.position(10, 10);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(10, 40);
  separationSlider = createSlider(0, 2, 2, 0.1);
  separationSlider.position(10, 70);
  for (let i = 0; i < 300; i++) {
    flock.push(new Boid(img1));
  }
}
$.getJSON("Penguins/animationData.json", function (data) {
  //sprites_to_draw[1].push( new Sprite(data, 0 ,0, "idleSpin") );
  //sprites_to_draw[1].push( new Sprite(data, 100 ,100, "idleWave") );
  //sprites_to_draw[1].push(new Sprite(data, 150, 650, "idle"));
  
  sprite = new Sprite(data, 400, 300, "idle");
  sprites_to_draw[1].push(sprite);
        
  sprite_wasd = new Sprite(data, 150, 300, "idle");
  sprites_to_draw[1].push(sprite_wasd);
});

$.getJSON("acid_bk/animationData.json", function (data) {
  sprites_to_draw[0].push(new BackgroundSprite(data, "default"));
});

$(document).ready(function () {
  console.log("Page is now ready");
  resize();

  /*(
    img.onload = function() {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = 'imgs/bk_lord.jpg';
    */

  draw_loop_timeout = setInterval(draw_loop, 33);
});

//window.addEventListener('resize', resize);

let start, previousTimeStamp;

function draw_loop() {
  if (start === undefined) {
    start = Date.now();
  } else if (Date.now() - start < 100) {
    requestAnimationFrame(draw_loop);
    return;
  }
  start = Date.now();

  var background_length = sprites_to_draw[0].length;
  var forground_length = sprites_to_draw[1].length;
  var has_background_changed = false;

  const context = canvas.getContext("2d");
  //context.clearRect(0, 0, canvas.width, canvas.height);
  clear();
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
  //Draw background sprites
  for (var i = 0; i < background_length; i++) {
    has_background_changed = sprites_to_draw[0][i].draw();
  }

  //Draw forground sprites
  for (var i = 0; i < forground_length; i++) {
    sprites_to_draw[1][i].draw({
      has_background_changed: has_background_changed,
      key_change: false,
    });
  }

  for (var i = 1; i < forground_length; i++) {
    if (
        sprites_to_draw[1][0].y <= sprites_to_draw[1][i].y + 200 &&
        sprites_to_draw[1][0].y >= sprites_to_draw[1][i].y &&
        sprites_to_draw[1][0].x + 150 <= sprites_to_draw[1][i].x + 200 &&
        sprites_to_draw[1][0].x + 150 >= sprites_to_draw[1][i].x
    ) {
        //alert("Game Over");
        //sprites_to_draw[1][0].y = (sprites_to_draw[1][i].y + 90) +100
        //sprites_to_draw[1][0].y = (sprites_to_draw[1][i].y) + 51
        //sprites_to_draw[1][0].x  = (sprites_to_draw[1][i].x + 10) +100
        //sprites_to_draw[1][0].x = (sprites_to_draw[1][i].x) +31

        sprite_wasd.state = "idleSpin";
        sprite_wasd.x_v = 0
        sprite_wasd.y_v = 0

        sprite.state = "idleSpin";
        sprite.x_v = 0
        sprite.y_v = 0
        sprite.x = prites_to_draw[1][i].x + 100
    }

}
  requestAnimationFrame(draw_loop);
}
function changeBk(background) {
  if (sprites_to_draw[0][0].state !== background) {
    $.getJSON("acid_bk/animationData.json", function (data) {
      sprites_to_draw[0][0] = new BackgroundSprite(data, background);
      switch (background) {
        case "default":
          //sprites_to_draw[1][0].y = 150;
          sprite.y = 150;
          sprite_wasd.y = 150;
          break;
        case "left":
          //sprites_to_draw[1][0].x = canvas.width - 200;
          sprite.x = canvas.width - 200;
          sprite_wasd.x = canvas.width - 200;

          break;
        case "right":
          //sprites_to_draw[1][0].x = 150;
          sprite.x = 150;
          sprite_wasd.x = 150;

          break;
        case "top":
          //sprites_to_draw[1][0].y = canvas.height - 150;
          sprite.y = canvas.height - 150;
          sprite_wasd.y = canvas.height - 150;

          break;
      }

      
    });

    console.log(background);
  }
}
/*
document.body.onkeypress = function (e) {
  sprites_to_draw[1][0].cur_frame = 0;
};
document.body.onkeydown = function (e) {
  if (reset === true) {
    sprites_to_draw[1][0].cur_frame = 0;
    reset = false;
  }
  var key = e.keyCode;
  console.log(key);
  $("#test").css("color", "green");
  if (key === up_arrow) {
    console.log("up arrow");

    sprites_to_draw[1][0].y_v = -20;
    sprites_to_draw[1][0].state = "walk_N";
  } else if (key === down_arrow) {
    console.log("down arrow");

    sprites_to_draw[1][0].y_v = 20;
    sprites_to_draw[1][0].state = "walk_S";
  } else if (key === left_arrow) {
    console.log("left arrow");

    sprites_to_draw[1][0].x_v = -20;
    sprites_to_draw[1][0].state = "walk_W";
  } else if (key === right_arrow) {
    console.log("right arrow");

    sprites_to_draw[1][0].x_v = 20;
    sprites_to_draw[1][0].state = "walk_E";
  }


  //


  if (key === w) {
    console.log("up arrow");

    sprites_to_draw[1][0].y_v = -20;
    sprites_to_draw[1][0].state = "walk_N";
  } else if (key === s) {
    console.log("down arrow");

    sprites_to_draw[1][0].y_v = 20;
    sprites_to_draw[1][0].state = "walk_S";
  } else if (key === a) {
    console.log("left arrow");

    sprites_to_draw[1][0].x_v = -20;
    sprites_to_draw[1][0].state = "walk_W";
  } else if (key === d) {
    console.log("right arrow");

    sprites_to_draw[1][0].x_v = 20;
    sprites_to_draw[1][0].state = "walk_E";
  }

  
};*/


document.body.onkeydown = function(e) {

  // Update sprite's state based on arrow key pressed
  if (e.keyCode == up_arrow) {
      sprite.state = "walk_N";
      sprite.y_v = -10
      sprite.x_v = 0
      sprite.cur_frame = 0;
      //e.preventDefault();
  }
  if (e.keyCode == down_arrow) {
      sprite.state = "walk_S";
      sprite.y_v = 10
      sprite.x_v = 0
      sprite.cur_frame = 0;
  }
  if (e.keyCode == right_arrow) {
      sprite.state = "walk_E";
      sprite.x_v = 10
      sprite.y_v = 0
      sprite.cur_frame = 0;
  }
  if (e.keyCode == left_arrow) {
      sprite.state = "walk_W";
      sprite.x_v = -10
      sprite.y_v = 0
      sprite.cur_frame = 0;
  }
  if (e.keyCode == enter_key){
      sprite.state = "idleWave";
      sprite.x_v = 0
      sprite.y_v = 0
      sprite.cur_frame = 0;

  }

  //second sprite movement
  if (e.keyCode == w_key) {
      sprite_wasd.state = "walk_N";
      sprite_wasd.y_v = -10
      sprite_wasd.x_v = 0
      sprite_wasd.cur_frame = 0;
      //e.preventDefault();
  }
  if (e.keyCode == s_key) {
      sprite_wasd.state = "walk_S";
      sprite_wasd.y_v = 10
      sprite_wasd.x_v = 0
      sprite_wasd.cur_frame = 0;
  }
  if (e.keyCode == d_key) {
      sprite_wasd.state = "walk_E";
      sprite_wasd.x_v = 10
      sprite_wasd.y_v = 0
      sprite_wasd.cur_frame = 0;
  }
  if (e.keyCode == a_key) {
      sprite_wasd.state = "walk_W";
      sprite_wasd.x_v = -10
      sprite_wasd.y_v = 0
      sprite_wasd.cur_frame = 0;
  }
  if (e.keyCode == space){

      sprite_wasd.state = "idleWave";
      sprite_wasd.x_v = 0
      sprite_wasd.y_v = 0
      sprite_wasd.cur_frame = 0;

  }
};

/*
document.body.onkeyup = function (e) {
  reset = true;
  sprites_to_draw[1][0].x_v = 0;
  sprites_to_draw[1][0].y_v = 0;
  sprites_to_draw[1][0].state = "idle";
  $("#test").css("color", "red");
};
*/
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  offscreen.width = window.innerWidth;
  offscreen.height = window.innerHeight;
}
