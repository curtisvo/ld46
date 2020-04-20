import 'phaser';
import { Game } from 'phaser';
import WinScene from './winScene';
import IntroScene from './introScene';
import GameoverScene from './gameoverScene';

const CIRCLE_INIT_X: integer = 400;
const CIRCLE_INIT_Y: integer = 200;
const FAN_INIT_X: integer = 300;

//todo:  30 or 60 ?
const MAX_TIME: integer = 10;
const MAX_LEVEL: integer = 5;
const LEVEL_ACCEL_MOD: integer = 50;
const BABY_ACCELERATION: integer = 100;

// temp, find a nice width
const FAN_WIDTH: integer = 150;

enum GameState {
    STOPPED, RUNNING, WIN, LOSE
}

export default class GameScene extends Phaser.Scene
{
    currentLevel: integer;
    lives: integer;
    startTime: Date;
    
    interval: any;

    // temp, use a sprite later
    fan: any;

    gameState: GameState;

    private baby: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body };
    debugText: Phaser.GameObjects.Text;
    gameoverText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
 
    constructor ()
    {
        super('gameScene');
    }

    preload ()
    {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('spikes', 'assets/spikes.png');
        this.load.image('baby', 'assets/baby-whiteparachute.png');
    }

    create ()
    {
        this.currentLevel = 1;
        this.lives = 3;
        this.gameState = GameState.STOPPED;

        this.add.image(400, 300, 'bg');

        let topspikes = this.physics.add.image(400, 10, 'spikes').setRotation(3.14).setImmovable(true);
        let bottomspikes = this.physics.add.image(400, game.renderer.height-10, 'spikes').setImmovable(true);
        
        this.baby = this.add.sprite(CIRCLE_INIT_X, CIRCLE_INIT_Y, 'baby') as any;
        this.physics.add.existing(this.baby);
        this.baby.body.setCollideWorldBounds(true);

        this.fan = this.add.rectangle(FAN_INIT_X, game.renderer.height-20, FAN_WIDTH, 20, 0x0000ff);
        this.physics.add.existing(this.fan);
        
        this.debugText = this.add.text(0, 50, '', { font: '18px Courier', fill: '#00ff00' });
        this.levelText = this.add.text(350, 350, '', { font: '36px Arial Black', fill: '#ff0000' });
        
        this.physics.add.overlap(this.baby, topspikes, this.die, null, this);
        this.physics.add.overlap(this.baby, bottomspikes, this.die, null, this);        
        this.physics.add.overlap(this.baby, this.fan, this.die, null, this);

        this.pointerLock();
    }

    update ()
    {
        // fan control / baby accel
        if (this.gameState === GameState.RUNNING) {
            let now:Date = new Date();
            let countdown:number = MAX_TIME - (now.valueOf() - this.startTime.valueOf())/1000;
            if (countdown < 0) 
            {
                // careful, only works because we stop the game
                this.levelUp();
                return;
            }

            this.debugText.setText(
                'level: '+this.currentLevel + 
                '\nlives: '+ this.lives+
                "\ncountdown: "+countdown.toPrecision(2));

            if (this.baby.x > this.fan.x-FAN_WIDTH/2 &&
                this.baby.x < this.fan.x+FAN_WIDTH/2) {

                    if (this.baby.x > this.fan.x) {
                        this.baby.body.setAccelerationX(100)
                    }

                    if (this.baby.x < this.fan.x) {
                        this.baby.body.setAccelerationX(-100)
                    }

                    this.baby.body.setAccelerationY((BABY_ACCELERATION+(this.currentLevel*LEVEL_ACCEL_MOD))*-1);
                    //this.baby.body.setAccelerationY((BABY_ACCELERATION*-1));
                }
            else {
                this.baby.body.setAccelerationY(BABY_ACCELERATION+(this.currentLevel*LEVEL_ACCEL_MOD));
                //this.baby.body.setAccelerationY(BABY_ACCELERATION);
            }
        }

        // change baby direction
        if (this.baby.body.velocity.x > 0) 
        {
            this.baby.setFlipX(false);
            this.baby.setRotation(0.3);
        }
        else 
        {
            this.baby.setFlipX(true);
            this.baby.setRotation(-0.3);
        }
        
    }

    die () 
    {
        this.lives--;
        if (this.lives == 0)
        {
            this.gameover();
        }
        else 
        {
            this.resetBall();
        }
    }

    pointerLock() 
    {
        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', function (pointer) {
            if (this.gameState != GameState.RUNNING)
            {
                this.startTime = new Date();
                this.levelText.setText('');
                this.gameState = GameState.RUNNING;
            }
            this.input.mouse.requestPointerLock();
        }, this);
    
        // When locked, you will have to use the movementX and movementY properties of the pointer
        // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {
                // todo: migth want to limit this to the game width?
                this.fan.x += pointer.movementX;

                // make the fan tilt
                if (pointer.movementX > 0) { this.fan.setRotation(0.1); }
                else if (pointer.movementX < 0) { this.fan.setRotation(-0.1); }
                else { this.fan.setRotation(0); }    
            }
        }, this);
    
        // Exit pointer lock when Q is pressed. Browsers will also exit pointer lock when escape is
        // pressed.
        this.input.keyboard.on('keydown_Q', function (event) {
            if (this.input.mouse.locked)
            {
                this.input.mouse.releasePointerLock();
            }
        }, this);
    }

    gameover () 
    {
        this.scene.start('gameoverScene');
    }

    resetBall()
    {
        this.gameState = GameState.STOPPED;
        // reset ball
        this.baby.body.setAccelerationX(0);
        this.baby.body.setAccelerationY(0);
        this.baby.body.setVelocityX(0);
        this.baby.body.setVelocityY(0);
        this.baby.setPosition(CIRCLE_INIT_X, CIRCLE_INIT_Y);
    }

    levelUp() 
    {
        this.currentLevel++;
        this.levelText.setText('Level '+this.currentLevel+'!');
        if (this.currentLevel > MAX_LEVEL)
        {
            this.scene.start('winScene');
        }
        else 
        {
            //this.resetBall();
        }
        this.resetBall();
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [IntroScene, GameScene, WinScene, GameoverScene],
    physics: {
        default: 'arcade',
        arcade: { 
            //debug: true 
        }
    },};

const game = new Phaser.Game(config);
