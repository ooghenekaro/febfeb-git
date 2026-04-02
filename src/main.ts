import GameScene from './scenes/GameScene'

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#5c94fc',
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false
        }
      },
      scene: [GameScene]
    }

    new Phaser.Game(config)
    