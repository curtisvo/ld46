import 'phaser';

enum PlantState {
    Small, Medium, Budding, Flower
}

const TOOLS_COUNT = 2
enum PlayerTool {
    WateringCan, FlySwatter,
    //NutrientCan
}


export default class GameScene extends Phaser.Scene
{
    lives: integer;
    water: integer;
    nutrients: integer;
    points: integer;
    currentTool: PlayerTool;
    sprite: Phaser.GameObjects.Sprite = null;
 
    constructor ()
    {
        super('gameScene');
        this.lives = 3;
        this.water = 100;
        this.nutrients = 100;
        this.points = 0;
        this.currentTool = PlayerTool.WateringCan;
    }

    preload ()
    {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('plant-sm', 'assets/small-plant.png');
        this.load.image('tool'+PlayerTool.WateringCan, 'assets/wateringcan.png');
        this.load.image('tool'+PlayerTool.FlySwatter, 'assets/flyswatter.png');
    }

    create ()
    {
        // why does phaser do it like this?
        //  Using the Scene Data Plugin we can store data on a Scene level
        //this.data.set('lives', 3);
        //this.data.set('level', 5);
        //this.data.set('score', 2000);

        this.add.image(400, 300, 'bg');
        this.add.image(400, 394, 'plant-sm');
        //this.add.rectangle

        this.pointerLock();
    }

    update ()
    {
    }

    incrementCurrentTool() 
    {
        if (this.currentTool == TOOLS_COUNT-1)
        {
            this.currentTool = PlayerTool.WateringCan;
        }
        else 
        {
            this.currentTool++;
        }
        console.log('returning: ' + 'tool'+this.currentTool )
        return 'tool'+this.currentTool;
    }

    pointerLock() 
    {
        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', function (pointer) {
            if (pointer.button === 2) 
            {
                this.sprite.setTexture(this.incrementCurrentTool());
            }
            console.log(pointer.button);
    
            this.input.mouse.requestPointerLock();
            if (this.sprite === null) 
            {
                this.sprite = this.add.sprite(400, 300, 'tool'+this.currentTool);
            }
    
        }, this);
    
        // When locked, you will have to use the movementX and movementY properties of the pointer
        // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {
                this.sprite.x += pointer.movementX;
                this.sprite.y += pointer.movementY;
    
                // Force the sprite to stay on screen
//                this.sprite.x = Phaser.Math.Wrap(this.sprite.x, 0, game.renderer.width);
//                this.sprite.y = Phaser.Math.Wrap(this.sprite.y, 0, game.renderer.height);
    
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
    scene: GameScene
};

const game = new Phaser.Game(config);
