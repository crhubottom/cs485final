const up_arrow = 38;
const down_arrow = 40;
const left_arrow = 37;
const right_arrow = 39;
const enter = 13;
const w = 87;
const s = 83;
const a = 65;
const d = 68;
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
function setup() {
  createCanvas(1920, 1080);
  alignSlider = createSlider(0, 2, 1.5, 0.1);
  alignSlider.position(10, 10);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(10, 40);
  separationSlider = createSlider(0, 2, 2, 0.1);
  separationSlider.position(10, 70);
  for (let i = 0; i < 300; i++) {
    flock.push(new Boid());
  }
}
$.getJSON("Penguins/animationData.json", function (data) {
  //sprites_to_draw[1].push( new Sprite(data, 0 ,0, "idleSpin") );
  //sprites_to_draw[1].push( new Sprite(data, 100 ,100, "idleWave") );
  sprites_to_draw[1].push(new Sprite(data, 150, 650, "idle"));
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
    clear();
    for (let boid of flock) {
      boid.edges();
      boid.flock(flock);
      boid.update();
      boid.show();
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
          sprites_to_draw[1][0].y = 150;
          break;
        case "left":
          sprites_to_draw[1][0].x = canvas.width - 200;
          break;
        case "right":
          sprites_to_draw[1][0].x = 150;
          break;
        case "top":
          sprites_to_draw[1][0].y = canvas.height - 150;
          break;
      }
    });

    console.log(background);
  }
}
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
};
document.body.onkeyup = function (e) {
  reset = true;
  sprites_to_draw[1][0].x_v = 0;
  sprites_to_draw[1][0].y_v = 0;
  sprites_to_draw[1][0].state = "idle";
  $("#test").css("color", "red");
};
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  offscreen.width = window.innerWidth;
  offscreen.height = window.innerHeight;
}
