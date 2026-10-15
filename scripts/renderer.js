import * as CG from './transforms.js';
<<<<<<< HEAD
import { Matrix } from "./matrix.js";
=======
import { Matrix } from './matrix.js'; //imported -Jack 9:40pm 10/9
>>>>>>> 2de813c82c5a5cc957ca55694ae188f65628257c

            
class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;

        // Pacman starts paused
        this.pacmanPlaying = false;

        this.start_time = null;
        this.prev_time = null;
        this.angle1 = 0;
        this.angle2 = 0;
        this.angle3 = 0;

        this.models = {
            
            slide0: [
                // bouncing ball (circle made from a many-sided polygon centered at the origin)
                {
                    vertices: [],                                   // filled in below
                    radius: 40,
                    position: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
                    velocity: { x: 250, y: 180 },                   // pixels per second
                    transform: null
                }
            ],
            slide1: [],
            slide2: [
                // square - grows/shrinks uniformly
                {
                    vertices: [
                        CG.Vector3(150, 250, 1),
                        CG.Vector3(250, 250, 1),
                        CG.Vector3(250, 350, 1),
                        CG.Vector3(150, 350, 1)
                    ],
                    center: { x: 200, y: 300 },
                    rate: 0.5,                                      // grow/shrink cycles per second
                    min_scale: { x: 0.5, y: 0.5 },
                    max_scale: { x: 1.5, y: 1.5 },
                    transform: null
                },
                // hexagon - grows/shrinks NON-uniformly (stretches in x while squashing in y)
                {
                    vertices: [
                        CG.Vector3(650, 300, 1),
                        CG.Vector3(600, 387, 1),
                        CG.Vector3(500, 387, 1),
                        CG.Vector3(450, 300, 1),
                        CG.Vector3(500, 213, 1),
                        CG.Vector3(600, 213, 1)
                    ],
                    center: { x: 550, y: 300 },
                    rate: 1.0,
                    min_scale: { x: 0.5, y: 1.4 },
                    max_scale: { x: 1.4, y: 0.5 },
                    transform: null
                }
            ],
<<<<<<< HEAD
            slide3: []
        };
=======
             slide1: [
                {
                    // Red Square
                    vertices: [
                        CG.Vector3(-50, -50, 1),
                        CG.Vector3(50, -50, 1),
                        CG.Vector3(50, 50, 1),
                        CG.Vector3(-50, 50, 1)
                    ],
                    angle: 0,
                    velocity: 0.5,
                    position: [300, 300],
                    color: [255, 0, 0, 255]
                },
                {
                    // Blue Triangle
                    vertices: [
                        CG.Vector3(0, -60, 1),
                        CG.Vector3(60, 30, 1),
                        CG.Vector3(-60, 30, 1)
                    ],
                    angle: 0,
                    velocity: -0.25,
                    position: [450, 150],
                    color: [0, 0, 255, 255]
                },
                {
                    // Green Hexagon
                    vertices: [
                        CG.Vector3(60, 0, 1),
                        CG.Vector3(30, 52, 1),
                        CG.Vector3(-30, 52, 1),
                        CG.Vector3(-60, 0, 1),
                        CG.Vector3(-30, -52, 1),
                        CG.Vector3(30, -52, 1)
                    ],
                    angle: 0,
                    velocity: 1.0,
                    position: [500, 400],
                    color: [0, 255, 0, 255]
                }
            ],
            slide2: [],

            slide3:
                {
                    phase: "firstpass",
                    pacman: {
                        position: [200, 300],
                        radius: 45,
                        mouthAngle: Math.PI / 5,
                        angle: 0,
                        scale: 1,
                        color: [255, 220, 0, 255]
                    },
                    pellets: [],
                    
                    ghosts: [
                        {
                            // red ghost (Blinky)
                            position: [-150, 300],
                            speed: 140,
                            color: [255, 0, 0, 255]
                        },
                        {
                            // pink ghost (Pinky)
                            position: [850, 300],
                            speed: -110,
                            color: [255, 105, 180, 255]
                        },
                        {
                            // cyan ghost (Inky)
                            position: [1000, 300],
                            speed: -110,
                            color: [0, 255, 255, 255]
                        },
                        {
                            // orange ghost (Clyde)
                            position: [1150, 300],
                            speed: -110,
                            color: [255, 165, 0, 255]
                        }
                    ]
                }
        };

        // Slide 3: Create pellets along the corridor
        for (let x = 0; x <= 800; x += 40) {
            this.models.slide3.pellets.push({
                x: x,
                y: 300,
                eaten: false
            });
        }

    }
>>>>>>> 2de813c82c5a5cc957ca55694ae188f65628257c


    
        // build the ball's vertices (circle of radius r around the origin)
        let ball = this.models.slide0[0];
        let sides = 40;
        for (let i = 0; i < sides; i++) {
            let angle = (2 * Math.PI * i) / sides;
            ball.vertices.push(CG.Vector3(ball.radius * Math.cos(angle), ball.radius * Math.sin(angle), 1));
        }
        ball.transform = new Matrix(3, 3);
        CG.mat3x3Translate(ball.transform, ball.position.x, ball.position.y);
 
        // start slide 2 polygons with identity transforms
        for (let i = 0; i < this.models.slide2.length; i++) {
            this.models.slide2[i].transform = new Matrix(3, 3);
            CG.mat3x3Identity(this.models.slide2[i].transform);
        }
    }
 
    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }
 
    // n:  int
    setFps(n) {
        this.fps = n;
    }
 
    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }
 
    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));
 
        // Update transforms for animation
        this.updateTransforms(time, delta_time);
 
        // Draw slide
        this.drawSlide();
 
        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }
 
        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }
 
    //
    updateTransforms(time, delta_time) {
<<<<<<< HEAD
        // convert ms -> seconds so speeds are "per second" (time-based, not frame-based)
        let t = time / 1000.0;
        let dt = delta_time / 1000.0;
 
        // ---------- Slide 0: bouncing ball ----------
        let ball = this.models.slide0[0];
        ball.position.x += ball.velocity.x * dt;
        ball.position.y += ball.velocity.y * dt;
 
        // left / right edges -> reverse x velocity
        if (ball.position.x - ball.radius <= 0) {
            ball.position.x = ball.radius;
            ball.velocity.x = -ball.velocity.x;
        }
        else if (ball.position.x + ball.radius >= this.canvas.width) {
            ball.position.x = this.canvas.width - ball.radius;
            ball.velocity.x = -ball.velocity.x;
        }
 
        // top / bottom edges -> reverse y velocity
        if (ball.position.y - ball.radius <= 0) {
            ball.position.y = ball.radius;
            ball.velocity.y = -ball.velocity.y;
        }
        else if (ball.position.y + ball.radius >= this.canvas.height) {
            ball.position.y = this.canvas.height - ball.radius;
            ball.velocity.y = -ball.velocity.y;
        }
 
        CG.mat3x3Translate(ball.transform, ball.position.x, ball.position.y);
 
        // ---------- Slide 2: grow / shrink about own center ----------
        for (let i = 0; i < this.models.slide2.length; i++) {
            let poly = this.models.slide2[i];
 
            // wave goes smoothly 0 -> 1 -> 0, 'rate' times per second
            let wave = (Math.sin(2 * Math.PI * poly.rate * t) + 1) / 2;
            let sx = poly.min_scale.x + (poly.max_scale.x - poly.min_scale.x) * wave;
            let sy = poly.min_scale.y + (poly.max_scale.y - poly.min_scale.y) * wave;
 
            // move center to origin -> scale -> move back
            let to_origin = new Matrix(3, 3);
            CG.mat3x3Translate(to_origin, -poly.center.x, -poly.center.y);
 
            let scale = new Matrix(3, 3);
            CG.mat3x3Scale(scale, sx, sy);
 
            let back = new Matrix(3, 3);
            CG.mat3x3Translate(back, poly.center.x, poly.center.y);
 
            poly.transform = Matrix.multiply([back, scale, to_origin]);
        }
 
        // TODO (teammates): slide 1 and slide 3 transforms
=======
        // TODO: update any transformations needed for animation
        // Jack: 10/9 7:11
        let spinVelocity = 0.5;
        let deltaSeconds = delta_time / 1000;

        // Update the rotation angle for each polygon in slide1
        for (let polygon of this.models.slide1) {
            polygon.angle += polygon.velocity * 2 * Math.PI * deltaSeconds;
        }

        // Slide 3: 
        // Prevent slide 3 from updating automatically until the user presses the "Play" button
        // if (this.slide_idx === 3 && this.pacmanPlaying) {

        //     // Animate Pacman's mouth
        //     let pacman = this.models.slide3.pacman;
        //     let seconds = time / 1000;
        //     pacman.mouthAngle = 0.5 * Math.abs(Math.sin(seconds * 6));

        //     // Move Pacman horizontally
        //     let speed = 140; // pixels per second
        //     pacman.position[0] += speed * deltaSeconds;

        //     // Check if Pacman has eaten any pellets
        //     for (let pellet of this.models.slide3.pellets) {
        //         if (!pellet.eaten && Math.abs(pacman.position[0] - pellet.x) < 10) {
        //             pellet.eaten = true;
        //         }
        //     }
        //     // Move ghosts during ambush phase
        //     if (this.models.slide3.phase !== "firstpass") {
        //         for (let ghost of this.models.slide3.ghosts) {
        //             ghost.position[0] += ghost.speed * deltaSeconds;
        //         }
        //     }

        //     // Pacman finishes the first pass and reappears on the left side of the screen
        //     if (pacman.position[0] > this.canvas.width + pacman.radius) {
        //         pacman.position[0] = -pacman.radius;

        //         if (this.models.slide3.phase === "firstpass") {
        //             this.models.slide3.phase = "ambush";
        //         }
        //     }

        //     // Update the rotation angle for each polygon

        //     let angularVelocity = spinVelocity * 2 * Math.PI;

        //     console.log("Angle 1: ", this.angle1);
        //     console.log("Angle 2: ", this.angle2);
        //     console.log("Angle 3: ", this.angle3);

        if (this.slide_idx === 3 && this.pacmanPlaying) {

            let scene = this.models.slide3;
            let pacman = scene.pacman;
            let dt = deltaSeconds;

            // Animate Pacman's mouth
            if (scene.phase !== "collisionPause") {
                pacman.mouthAngle = 0.5 * Math.abs(Math.sin(time / 1000 * 6));
            }

            // Phase 1: Pacman moves across the screen and eats pellets
            if (scene.phase === "firstpass") {
                pacman.position[0] += 140 * dt;

                // Remove pellets as Pacman
                for (let pellet of scene.pellets) {
                    if (Math.abs(pacman.position[0] - pellet.x) < 10) {
                        pellet.eaten = true;
                    }
                }
            
            // Finish the first pass and reappear on the left
            if (pacman.position[0] > this.canvas.width + pacman.radius) {
                pacman.position[0] = -pacman.radius;
                scene.phase = "secondpass";
            }
        }

        // Phase 2: Pacman flees left; three ghosts chase him
        else if (scene.phase === "secondpass") {
            pacman.position[0] += 140 * dt;

            for (let pellet of scene.pellets) {
                if (Math.abs(pacman.position[0] - pellet.x) < 10) {
                    pellet.eaten = true;
                }
            }
        
            if (pacman.position[0] >= 500) {
                scene.phase = "pinkyEntering";
            }
        }

        else if (scene.phase === "pinkyEntering") {
            pacman.position[0] += 140 * dt;

            // Pinky, Inky, and Clyde enter from the right side of the screen
            for (let i = 1; i < scene.ghosts.length; i++) {
                scene.ghosts[i].position[0] -= 140 * dt;
            }

            if (pacman.position[0] >= 600) {
                scene.phase = "ambush";
                pacman.angle = Math.PI; // Pacman turns left
            }
        }

        // Phase 3: Pacman turns right, into the chasing ghosts
        else if (scene.phase ===  "ambush") {
            pacman.position[0] -= 140 * dt;

            // Move Pinky, Inky, and Clyde leftward
            for (let i = 1; i < scene.ghosts.length; i++) {
                scene.ghosts[i].position[0] -= 140 * dt;
            }

            // Move Blinky rightward
            if (pacman.position[0] <= 450) {
                scene.phase = "blinkyEntering";
            }
        }

        else if (scene.phase === "blinkyEntering") {
            pacman.position[0] -= 140 * dt;

            for (let i = 1; i < scene.ghosts.length; i++) {
                scene.ghosts[i].position[0] -= 140 * dt;
            }

            scene.ghosts[0].position[0] += 140 * dt; // Blinky moves rightward

            if (pacman.position[0] <= 250) {
                scene.phase = "blocked";
                pacman.angle = 0; // Pacman turns right
            }
        }

        else if (scene.phase === "blocked") {
            pacman.position[0] += 140 * dt;

            // Blinky keeps moving right until the collision
            scene.ghosts[0].position[0] += 140 * dt;

            for (let i = 1; i < scene.ghosts.length; i++) {
                scene.ghosts[i].position[0] -= 140 * dt;
            }

            // Check whether Pinky catches Pacman
            let pinky = scene.ghosts[1];
            let distance = Math.abs(
                pacman.position[0] - pinky.position[0]
            );

            if (distance <= pacman.radius * pacman.scale + 40) {
                // Keep their outer bounds touching instead of overlapping
                 pacman.position[0] =
                    pinky.position[0] - (pacman.radius * pacman.scale + 40);

                scene.phase = "collisionPause";
                scene.pauseRemaining = 0.5; // pause for 0.5 seconds before Pacman spins and shrinks
            }
        }
        
        else if (scene.phase === "collisionPause") {
            scene.pauseRemaining -= dt;

            if (scene.pauseRemaining <= 0) {
                scene.phase = "gameover";
            }
        }

        // Phase 4: Pacman spins and shrinks
        else if (scene.phase === "gameover") {
            pacman.angle += 4 * Math.PI * dt;
            pacman.scale = Math.max(0, pacman.scale - 0.4 * dt);
            pacman.mouthAngle = Math.PI / 5;

            if (pacman.scale === 0) {
                scene.phase = "finished";
            }
        }
>>>>>>> 2de813c82c5a5cc957ca55694ae188f65628257c
    }
}

    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }
 
    //
    drawSlide0() {
        // bouncing ball: apply the ball's translation to every vertex, then draw
        let ball = this.models.slide0[0];
        let transformed = [];
        for (let i = 0; i < ball.vertices.length; i++) {
            transformed.push(Matrix.multiply([ball.transform, ball.vertices[i]]));
        }
        let tomato = [138, 43, 226, 255];
        this.drawConvexPolygon(transformed, tomato);
    }
 
    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        // Visit every polygon in slide1
        for (let polygon of this.models.slide1) {

            // Create rotation matrix
            let rotation = new Matrix(3, 3);
            CG.mat3x3Rotate(rotation, polygon.angle);

            // Create translation matrix
            let translation = new Matrix(3, 3);
            CG.mat3x3Translate(
                translation,
                polygon.position[0],
                polygon.position[1]
            );

            // Transform every vertex
            let transformedVertices = [];

            for (let vertex of polygon.vertices) {
                let rotatedVertex = rotation.mult(vertex);
                let finalVertex = translation.mult(rotatedVertex);
                
                transformedVertices.push(finalVertex);
            }

            // Draw this polygon
            this.drawConvexPolygon(transformedVertices, polygon.color);
        }
    }
 
    //
    drawSlide2() {
       
        let colors = [
            [30, 144, 255, 255],    // square: blue
            [255, 105, 180, 255]    // hexagon: pink
        ];
        for (let p = 0; p < this.models.slide2.length; p++) {
            let poly = this.models.slide2[p];
            let transformed = [];
            for (let i = 0; i < poly.vertices.length; i++) {
                transformed.push(Matrix.multiply([poly.transform, poly.vertices[i]]));
            }
            this.drawConvexPolygon(transformed, colors[p % colors.length]);
        }
    }
<<<<<<< HEAD
 
    //
=======
    
    // Slide 3: Draw the ghost character

    drawGhost(ghost) {
        // Get ghost and Pac-Man positions
        let x = ghost.position[0];
        let y = ghost.position[1];
        let pacman = this.models.slide3.pacman;

        // Ghost body color
        this.ctx.fillStyle = `rgba(${ghost.color[0]}, ${ghost.color[1]}, ${ghost.color[2]}, 1)`;

        this.ctx.beginPath();

        // Ghost body dimensions
        let radius = 40;
        let bottom = y - 45;

        this.ctx.beginPath();

        // Rounded upper half
        this.ctx.arc(x, y, radius, Math.PI, 0, true);

        // Right side
        this.ctx.lineTo(x + radius, bottom);

        // Wavy bottom, from right to left
        this.ctx.lineTo(x + 30, bottom - 10);
        this.ctx.lineTo(x + 20, bottom);
        this.ctx.lineTo(x + 10, bottom - 10);
        this.ctx.lineTo(x, bottom);
        this.ctx.lineTo(x - 10, bottom - 10);
        this.ctx.lineTo(x - 20, bottom);
        this.ctx.lineTo(x - 30, bottom - 10);
        this.ctx.lineTo(x - radius, bottom);

        // Close the path and fill the body
        this.ctx.closePath();
        this.ctx.fill();

        // White eyes
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();

        this.ctx.ellipse(x - 15, y - 8, 11, 15, 0, 0, 2 * Math.PI);
        this.ctx.ellipse(x + 15, y - 8, 11, 15, 0, 0, 2 * Math.PI);

        this.ctx.fill();

        // Determine where the ghost is looking
        let eyeOffset;

        if (x < pacman.position[0]) {
            // Ghost is left of Pac-Man: look right
            eyeOffset = 3;
        }
        else {
            // Ghost is right of Pac-Man: look left
            eyeOffset = -3;
        }

        // Blue pupils
        this.ctx.fillStyle = "blue";
        this.ctx.beginPath();

        this.ctx.arc(x - 15 + eyeOffset, y - 8, 6, 0, 2 * Math.PI);
        this.ctx.arc(x + 15 + eyeOffset, y - 8, 6, 0, 2 * Math.PI);

        this.ctx.fill();
    }

    
>>>>>>> 2de813c82c5a5cc957ca55694ae188f65628257c
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        
        // Black arcade background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Blue maze walls
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 6;

        // Corridor walls
        let wallY = [160, 240, 360, 440];

        for (let y of wallY) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(800, y);
            this.ctx.stroke();
        }

        // Draw pellets that have not been eaten
        for (let pellet of this.models.slide3.pellets) {

            if (!pellet.eaten) {
            this.ctx.beginPath();
            this.ctx.arc(pellet.x, pellet.y, 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            }
        }
        
        // (translation, scaling, and rotation)
        let pacman = this.models.slide3.pacman;

        let vertices = [
            CG.Vector3(0, 0, 1)
        ];

        let segments = 60;

        for (let i = 0; i < segments; i++) {
            let theta = pacman.mouthAngle + i * 
            (2 * Math.PI - 2 * pacman.mouthAngle) / segments;

            let x = pacman.radius * Math.cos(theta);
            let y = pacman.radius * Math.sin(theta);
            
            vertices.push(CG.Vector3(x, y, 1));
        }
        
        let translation = new Matrix(3, 3);

        CG.mat3x3Translate(
            translation,
            pacman.position[0],
            pacman.position[1]
        );

        let rotation = new Matrix(3, 3);
        CG.mat3x3Rotate(rotation, pacman.angle);
        let scaling = new Matrix(3, 3);
        CG.mat3x3Scale(scaling, pacman.scale, pacman.scale);
        let transformedVertices = []; 

        for (let vertex of vertices) {
            transformedVertices.push(translation.mult(rotation.mult(scaling.mult(vertex))));
        }

        this.drawConvexPolygon(transformedVertices, pacman.color);

        // Draw ghosts
        if (this.models.slide3.phase !== "firstpass") {
            for (let ghost of this.models.slide3.ghosts) {
                this.drawGhost(ghost);
            }
        }
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};
 
export { Renderer };
 