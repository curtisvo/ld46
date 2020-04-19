import 'phaser';

export default class IntroScene extends Phaser.Scene
{
    constructor ()
    {
        super('introScene');
    }

    preload ()
    {
        this.load.image('intro', 'assets/intro.png');
    }

    create ()
    {
        this.add.image(400, 300, 'intro');

        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', function (pointer) {
            this.scene.start('gameScene');
        }, this);
    }
}