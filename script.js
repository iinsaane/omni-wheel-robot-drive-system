//the robot is All Wheel Drive using omnidirectional wheels
//left joystick y axis is for forward and backward
//left joystick x axis is for left and right
//right joystick y axis is for turning


const FORWARD_WEIGHT = [1, 1, 1, 1];
const STRAFE_WEIGHT = [1, -1, -1, 1];
const TURN_WEIGHT = [1, -1, 1, -1];
const MAX_GAMEPAD_DRIFT = 0.1;


let gamepad = {
    gamepad: null,
    axes: [0,0,0,0],
}

let wheels = {
    TL: 0,
    TR: 0,
    BL: 0,
    BR: 0,
}

function getGamepads() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];

    
    if (gp) {
        //loop through gamepad joystick positions
        //debugger
        gamepad.axes = gp.axes.map((a) => Math.round(a * 100) / 100);
        for (let i = 0; i < gp.axes.length; i++) {

            //set the axis to zero if it is less or greater than the max drift
            if (gamepad.axes[i] < MAX_GAMEPAD_DRIFT && gamepad.axes[i] > -MAX_GAMEPAD_DRIFT) {
                gamepad.axes[i] = 0;
            }
        }
        //invert the y axis
        gamepad.axes[1] = -gamepad.axes[1];
        gamepad.axes[3] = -gamepad.axes[3];
        gamepad.gamepad = gp;
    }
}

function updateWheels() {
    //update the wheels

    //forward
    wheels.TL = gamepad.axes[1] * FORWARD_WEIGHT[0];
    wheels.TR = gamepad.axes[1] * FORWARD_WEIGHT[1];
    wheels.BL = gamepad.axes[1] * FORWARD_WEIGHT[2];
    wheels.BR = gamepad.axes[1] * FORWARD_WEIGHT[3];

    //strafe
    wheels.TL += gamepad.axes[0] * STRAFE_WEIGHT[0];
    wheels.TR += gamepad.axes[0] * STRAFE_WEIGHT[1];
    wheels.BL += gamepad.axes[0] * STRAFE_WEIGHT[2];
    wheels.BR += gamepad.axes[0] * STRAFE_WEIGHT[3];

    //turn
    wheels.TL += gamepad.axes[2] * TURN_WEIGHT[0];
    wheels.TR += gamepad.axes[2] * TURN_WEIGHT[1];
    wheels.BL += gamepad.axes[2] * TURN_WEIGHT[2];
    wheels.BR += gamepad.axes[2] * TURN_WEIGHT[3];

    
    //normalize the wheels so that the highest value is 1 and the lowest value is -1
    let max = Math.max(wheels.TL, wheels.TR, wheels.BL, wheels.BR, 
            Math.abs(wheels.TL), Math.abs(wheels.TR), Math.abs(wheels.BL), Math.abs(wheels.BR));
    
    if (max > 1) {
        const multiplier = 1 / max;
        wheels.TL *= multiplier;
        wheels.TR *= multiplier;
        wheels.BL *= multiplier;
        wheels.BR *= multiplier;

    }

    //round the wheels to 2 decimal places
    wheels.TL = Math.round(wheels.TL * 100) / 100;
    wheels.TR = Math.round(wheels.TR * 100) / 100;
    wheels.BL = Math.round(wheels.BL * 100) / 100;
    wheels.BR = Math.round(wheels.BR * 100) / 100;

}

function setup() {
  createCanvas(800, 400);
}

function draw() {
  //draw a circle for each joystick
  fill(250, 250, 250);
  background(220);
  fill(230, 230, 230);
  ellipse(200, 200, 400, 400);
    if (gamepad.gamepad) {


        fill(255, 0, 0);
        ellipse(200 + gamepad.axes[0] * 200, 200 + gamepad.axes[1] * 200 *-1, 20, 20);
        fill(0, 0, 255);
        ellipse(200 + gamepad.axes[2] * 200, 200 + gamepad.axes[3] * 200 *-1, 20, 20);

        //display the hoystick values as text
        fill(0);
        text("x: " + gamepad.axes[0], 410, 20);
        text("y: " + gamepad.axes[1], 410, 40);
        text("x: " + gamepad.axes[2], 410, 60);
        text("y: " + gamepad.axes[3], 410, 80);

        /**
         * draw the 4 robot wheel
         * a wheel is a rectangle with the height 2x the width
         * the wheel fills up with red from the middle up or down depending on the speed
         * the wheel displays a nuber from -1 to 1
         */
        fill (255, 255, 255);
        rect(500, 100, 40, 80);
        rect(500, 300, 40, 80);
        rect(600, 100, 40, 80);
        rect(600, 300, 40, 80);

        fill(255, 0, 0);
        rect(500, 140, 40, wheels.TL * -40);
        rect(500, 340, 40, wheels.BL * -40);
        rect(600, 140, 40, wheels.TR * -40);
        rect(600, 340, 40, wheels.BR * -40);
        
        
        fill(0, 0, 0);
        text(wheels.TL, 510, 120);
        text(wheels.BL, 510, 320);
        text(wheels.TR, 610, 120);
        text(wheels.BR, 610, 320);

    }
    //update the gamepad
    getGamepads();

    //update the wheels
    updateWheels();
}
