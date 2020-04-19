import 'phaser';

export default class WinScene extends Phaser.Scene
{
    constructor ()
    {
        super('winScene');
    }

    preload ()
    {
        this.load.image('win', 'assets/win.png');
    }

    create ()
    {
        this.add.image(400, 300, 'win');
    }
}