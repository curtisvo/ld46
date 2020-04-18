import 'phaser';

export default class GameScene extends Phaser.Scene
{
    lives: integer;
    points: integer;
    sprite: Phaser.GameObjects.Sprite;
    private circle: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
    debugText: Phaser.GameObjects.Text;
 
    constructor ()
    {
        super('gameScene');
        this.lives = 3;
        this.points = 0;
    }

    preload ()
    {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('fan', 'assets/fan.png');
    }

    create ()
    {
        // why does phaser do it like this?
        //  Using the Scene Data Plugin we can store data on a Scene level
        //this.data.set('lives', 3);
        //this.data.set('level', 5);
        //this.data.set('score', 2000);
        
        //this.add.image(400, 300, 'bg');
        this.circle = this.add.circle(400, 300, 10, 0xff0000) as any;
        this.physics.add.existing(this.circle);
        this.circle.body.setCollideWorldBounds(true);
        this.sprite = this.add.sprite(350, game.renderer.height-19, 'fan');
        
        this.debugText = this.add.text(0, 0, '', { font: '18px Courier', fill: '#00ff00' });
        
        this.pointerLock();
        
    }

    update ()
    {
        this.debugText.setText('circle x,y: '+this.circle.x+' '+this.circle.y + "\n sprite x,y: " + this.sprite.x +' '+this.sprite.y);
        
        if (this.circle.x > this.sprite.x-20 &&
            this.circle.x < this.sprite.x+20) {

                if (this.circle.x > this.sprite.x) {
                    this.circle.body.setAccelerationX(100)
                }

                if (this.circle.x < this.sprite.x) {
                    this.circle.body.setAccelerationX(-100)
                }

            this.circle.setFillStyle(0x00ff00);
            this.circle.body.setAccelerationY(-300);
        }
        else {
            this.circle.setFillStyle(0xff0000);
            this.circle.body.setAccelerationY(300);
        }
        
    }

    pointerLock() 
    {
        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', function (pointer) {
            this.input.mouse.requestPointerLock();
        }, this);
    
        // When locked, you will have to use the movementX and movementY properties of the pointer
        // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {

                // todo: migth want to limit this to the game width?
                this.sprite.x += pointer.movementX;

                // make the fan tilt
                if (pointer.movementX > 0) { this.sprite.setRotation(0.1); }
                else if (pointer.movementX < 0) { this.sprite.setRotation(-0.1); }
                else { this.sprite.setRotation(0); }    
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
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: { 
//            gravity: { y: 300 },
            debug: true 
        }
    },};

const game = new Phaser.Game(config);
