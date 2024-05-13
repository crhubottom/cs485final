class Boid {
  constructor(img1) {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;
    this.img = img1;
    this.showBoid = true;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    if (
      sprites_to_draw[1][0].x < this.position.x + 30 &&
      sprites_to_draw[1][0].x + 110 > this.position.x &&
      sprites_to_draw[1][0].y < this.position.y + 30 &&
      sprites_to_draw[1][0].y + 135 > this.position.y &&
      this.showBoid == true
    ) {
      this.showBoid = false;
      p1++;
      boidCount--;
      $("#p1").html("Player 1: " + p1);
    }
    if (
      sprites_to_draw[1][1].x < this.position.x + 30 &&
      sprites_to_draw[1][1].x + 110 > this.position.x &&
      sprites_to_draw[1][1].y < this.position.y + 30 &&
      sprites_to_draw[1][1].y + 135 > this.position.y &&
      this.showBoid == true
    ) {
      this.showBoid = false;
      p2++;
      boidCount--;
      $("#p2").html("Player 2: " + p2);
    }
    if (boidCount == 0) {
      if (p1 > p2) {
        $("#winText").html("Player 1 Wins!");
      } else if (p2 > p1) {
        $("#winText").html("Player 2 Wins!");
      } else {
        $("#winText").html("It's a tie!");
      }
      $("#winner").show();
      $("#scoreboard").hide();
      $("#mycanvas").hide();
      c.hide();
    }
    if (p1 + boidCount < p2) {
      $("#winText").html("Player 2 Wins by Majority!");
      $("#winner").show();
      $("#scoreboard").hide();
      $("#mycanvas").hide();
      c.hide();
    } else if (p2 + boidCount < p1) {
      $("#winText").html("Player 1 Wins by Majority!");
      $("#winner").show();
      $("#scoreboard").hide();
      $("#mycanvas").hide();
      c.hide();
    }
  }

  show() {
    if (this.showBoid == true) {
      image(this.img, this.position.x, this.position.y, 30, 30);
    }
  }
}
