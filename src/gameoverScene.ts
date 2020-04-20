import 'phaser';

export default class GameoverScene extends Phaser.Scene
{
    constructor ()
    {
        super('gameoverScene');
    }

    preload ()
    {
        //https://www.flickr.com/photos/24354425@N03/23801133325/in/photolist-Cge2HF-2cmyF2M-7B2Rbw-bsyrC1-5B2PWj-71y4Vy-7c3X4x-pZpsRK-P2c2sk-Mm6VLJ-7Sfn2R-tFVHd-7bQpEP-igj1qo-wG5JZ-3Q2p6j-6yBFGW-qznVsZ-6ner5v-6CAWZP-orHxNq-tvs9d-27DDYPo-wpLhs2-V7D9v-8B3CC8-ih5Hc5-2S8pV6-bvhy5K-erHyq-s6z1ig-dau71f-GhvmVw-ue5NH-68iwaX-7AxY3d-2oWCh5-7wQv9B-4RR1o8-XHe7Tt-7CdqjY-jN84R7-ue5RS-8LY2Dc-tFVH9-7vRBKp-HdP6mx-qvi7M8-deDWsA-28aEN
        this.load.image('gameover', 'assets/gameover.png');
    }

    create ()
    {
        this.add.image(400, 300, 'gameover');
        this.add.text(100, 500, 'Game Over!\nClick to try again, Esc to exit', { font: '36px Arial Black', fill: '#ff0000', align: 'center' });
        
        this.input.on('pointerdown', function (pointer) {
            this.scene.start('gameScene');
        }, this);
    }
}