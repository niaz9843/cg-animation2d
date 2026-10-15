import * as CG from './transforms.js';
import { Matrix } from "./matrix.js";

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
        this.start_time = null;
        this.prev_time = null;

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
            slide3: []
        };


    
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
    }
    
    //
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
 
    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
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
 