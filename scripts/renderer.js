import * as CG from './transforms.js';
import { Matrix } from './matrix.js'; //imported -Jack 9:40pm 10/9

            
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
        this.angle1 = 0;
        this.angle2 = 0;
        this.angle3 = 0;

        this.models = {
            slide0: [
                // example model (diamond) -> should be replaced with actual model
                {
                    vertices: [
                        CG.Vector3(400, 150, 1),
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                    ],
                    transform: null
                }
            ],
             slide1: [
                {
                    vertices: [
                        CG.Vector3(50, -50, 1),
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
                    position: [600, 450],
                    color: [0, 255, 0, 255]
                }


            //     {
            //         // Red Square
            //         vertices: [
            //             CG.Vector3(-50, -50, 1),
            //             CG.Vector3(50, -50, 1),
            //             CG.Vector3(50, 50, 1),
            //             CG.Vector3(-50, 50, 1)
            //         ],
            //         transform: null
            //     },
            //     {
            //         // Blue Triangle
            //         vertices: [
            //             CG.Vector3(-50, -50, 1),
            //             CG.Vector3(50, -50, 1),
            //             CG.Vector3(0, 50, 1)
            //         ],
            //         transform: null
            //     },
            //     {
            //         vertices: [
            //         // Green Hexagon
            //         CG.Vector3(60, 0, 1),
            //         CG.Vector3(30, 52, 1),
            //         CG.Vector3(-30, 52, 1),
            //         CG.Vector3(-60, 0, 1),
            //         CG.Vector3(-30, -52, 1),
            //         CG.Vector3(30, -52, 1)
            //     ],
            //     transform: null
            // },
            ],
            slide2: [],
            slide3: []
        };
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
        // TODO: update any transformations needed for animation
        // Jack: 10/9 7:11
        let spinVelocity = 0.5;
        let deltaSeconds = delta_time / 1000;

        // Update the rotation angle for each polygon in slide1
        for (let polygon of thiis.models.slide1) {
            polygon.angle += polygon.velocity * 2 * Math.PI * deltaSeconds;
        }

        // Update the rotation angle for each polygon

        let angularVelocity = spinVelocity * 2 * Math.PI;
        
        this.angle1 += velocity1 * 2 * Math.PI * deltaSeconds;
        this.angle2 += velocity2 * 2 * Math.PI * deltaSeconds;
        this.angle3 += velocity3 * 2 * Math.PI * deltaSeconds;

        console.log("Angle 1: ", this.angle1);
        console.log("Angle 2: ", this.angle2);
        console.log("Angle 3: ", this.angle3);
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
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        
        
        // Following lines are example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)
        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(this.models.slide0[0].vertices, teal);
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

            let transformedVertices = [];

            for (let vertex of polygon.vertices) {
                let rotatedVertex = rotation.mult(vertex);
                let finalVertex = translation.mult(rotatedVertex);
                
                transformedVertices.push(finalVertex);
            }

            // Draw this polygon
            this.drawConvexPolygon(transformedVertices, polygon.color);
        }
        
        // // Get the original square vertices
        // let vertices = this.models.slide1[0].vertices;

        // // Create the rotation matrix
        // let rotation = new Matrix(3, 3);
        // CG.mat3x3Rotate(rotation, this.angle1);

        // // Create the translation matrix
        // let translation = new Matrix(3, 3);
        // CG.mat3x3Translate(translation, 300, 300);

        // // Store the transformed vertices
        // let transformedSquareVertices = [];

        // // Rotate first, then translate each vertex
        // for (let vertex of vertices) {
        //     let rotatedVertex = rotation.mult(vertex);
        //     let finalVertex = translation.mult(rotatedVertex);
            
        //     transformedSquareVertices.push(finalVertex);
        // }

        // let red = [255, 0, 0, 255];

        // // Get the triangle's original vertices
        // let triangleVertices = this.models.slide1[1].vertices;

        // // Create the triangle's rotation matrix
        // let triangleRotation = new Matrix(3, 3);
        // CG.mat3x3Rotate(triangleRotation, this.angle2);

        // // Position the triangle at (450, 150)
        // let triangleTranslation = new Matrix(3, 3);
        // CG.mat3x3Translate(triangleTranslation, 400, 150);
        
        // // Store transformed triangle vertices
        // let transformedTriangleVertices = [];
        // for (let vertex of triangleVertices) {
        //     let rotatedVertex = triangleRotation.mult(vertex);
        //     let finalVertex = triangleTranslation.mult(rotatedVertex);
            
        //     transformedTriangleVertices.push(finalVertex);
        // }

        // let blue = [0, 0, 255, 255];

        // // Get the hexagon's original vertices
        // let hexagonVertices = this.models.slide1[2].vertices;

        // // Create the hexagon's rotation matrix
        // let hexagonRotation = new Matrix(3, 3);
        // CG.mat3x3Rotate(hexagonRotation, this.angle3);

        // // Position the hexagon at (600, 300)
        // let hexagonTranslation = new Matrix(3, 3);
        // CG.mat3x3Translate(hexagonTranslation, 500, 300);
        
        // // Store transformed hexagon vertices
        // let transformedHexagonVertices = [];
        // for (let vertex of hexagonVertices) {
        //     let rotatedVertex = hexagonRotation.mult(vertex);
        //     let finalVertex = hexagonTranslation.mult(rotatedVertex);
            
        //     transformedHexagonVertices.push(finalVertex);
        // }

        // let green = [0, 255, 0, 255];
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


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
