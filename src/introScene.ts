import 'phaser';

export default class IntroScene extends Phaser.Scene
{
    constructor ()
    {
        super('introScene');
    }

    preload ()
    {
        //https://www.flickr.com/photos/ducos/6038505845/in/photolist-acAVpK-axo2AM-65NDx7-23Rj1rf-e26qKP-24soUj5-27chaWL-2frk5sp-gfBgPp-41L2G-dGJH-AgFobi-JuynR-8negNy-26sfyRD-RW6E1C-3J2dg-WCtFHa-Cc1dxh-fqoP3o-2edY9XE-HYG1Jv-5uBT7C-ZCFYNG-Z67L7F-dd5pbj-CCUVBT-24AKh35-bVQswo-cqz1cd-2F4G1C-9aiG3A-nifyTQ-GvD787-MYAxNX-28NhLNw-3XhxjC-8JWvpr-26vzM47-ddzE85-XBqHgV-8JZxp7-srEZ6-FSYYkD-P2fJu6-kxRx-JTG1WB-KZuGnP-J1Ekh4-QjtLQA
        this.load.image('intro', 'assets/intro.png');
    }

    create ()
    {
        this.add.image(400, 300, 'intro');
        this.add.text(50, 50, 'Keep Baby Alive!!!\nClick to play!', { fill: '#ff0000' });

        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', function (pointer) {
            this.scene.start('gameScene');
        }, this);
    }
}