import Phaser from 'phaser'

    // Player configuration
    const PLAYER_SPEED = 200
    const JUMP_VELOCITY = -500
    const BIG_JUMP_VELOCITY = -600

    // Tile sizes
    const TILE_SIZE = 32
    const WORLD_WIDTH = 3000
    const WORLD_HEIGHT = 800

    export default class GameScene extends Phaser.Scene {
      private player!: Phaser.Physics.Arcade.Sprite
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
      private platforms!: Phaser.Physics.Arcade.StaticGroup
      private goombas!: Phaser.Physics.Arcade.Group
      private coins!: Phaser.Physics.Arcade.Group
      private questionBlocks!: Phaser.Physics.Arcade.StaticGroup
      private pipeGroup!: Phaser.Physics.Arcade.StaticGroup

      private isBig = false
      private isFire = false
      private canJump = false
      private score = 0
      private lives = 3
      private gameOver = false

      private scoreText!: Phaser.GameObjects.Text
      private livesText!: Phaser.GameObjects.Text
      private worldBounds = { width: WORLD_WIDTH, height: WORLD_HEIGHT }

      constructor() {
        super({ key: 'GameScene' })
      }

      preload() {
        this.createPlayerTexture()
        this.createGoombaTexture()
        this.createCoinTexture()
        this.createMushroomTexture()
        this.createFlowerTexture()
        this.createBrickTexture()
        this.createQuestionBlockTexture()
        this.createPipeTexture()
        this.createGroundTexture()
        this.createHillTexture()
        this.createCloudTexture()
        this.createStarTexture()
      }

      createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false })

        // Small Mario
        graphics.fillStyle(0xff0000)
        graphics.fillRect(8, 2, 16, 6)
        graphics.fillStyle(0xcc0000)
        graphics.fillRect(6, 6, 20, 4)
        graphics.fillStyle(0xffcc99)
        graphics.fillRect(10, 10, 12, 6)
        graphics.fillStyle(0x000000)
        graphics.fillRect(14, 12, 2, 4)
        graphics.fillRect(18, 12, 2, 4)
        graphics.fillRect(10, 18, 12, 4)
        graphics.fillStyle(0x0000cc)
        graphics.fillRect(10, 22, 12, 10)
        graphics.fillStyle(0xff0000)
        graphics.fillRect(8, 22, 4, 8)
        graphics.fillRect(20, 22, 4, 8)
        graphics.fillStyle(0xffcc00)
        graphics.fillRect(14, 24, 2, 2)
        graphics.fillRect(14, 28, 2, 2)
        graphics.fillStyle(0x8b4513)
        graphics.fillRect(8, 30, 6, 4)
        graphics.fillRect(18, 30, 6, 4)
        graphics.fillRect(8, 28, 2, 2)
        graphics.fillRect(22, 28, 2, 2)

        graphics.generateTexture('player', 32, 34)
        graphics.clear()

        // Big Mario
        graphics.fillStyle(0xff0000)
        graphics.fillRect(8, 2, 16, 6)
        graphics.fillStyle(0xcc0000)
        graphics.fillRect(6, 6, 20, 4)
        graphics.fillStyle(0xffcc99)
        graphics.fillRect(10, 10, 12, 8)
        graphics.fillStyle(0x000000)
        graphics.fillRect(14, 14, 2, 4)
        graphics.fillRect(18, 14, 2, 4)
        graphics.fillRect(10, 20, 12, 4)
        graphics.fillStyle(0x0000cc)
        graphics.fillRect(10, 24, 12, 14)
        graphics.fillStyle(0xff0000)
        graphics.fillRect(8, 24, 4, 10)
        graphics.fillRect(20, 24, 4, 10)
        graphics.fillStyle(0xffcc00)
        graphics.fillRect(14, 26, 2, 2)
        graphics.fillRect(14, 30, 2, 2)
        graphics.fillRect(14, 34, 2, 2)
        graphics.fillStyle(0x8b4513)
        graphics.fillRect(8, 36, 6, 4)
        graphics.fillRect(18, 36, 6, 4)
        graphics.fillRect(6, 34, 4, 4)
        graphics.fillRect(22, 34, 4, 4)

        graphics.generateTexture('playerBig', 32, 40)
        graphics.clear()

        // Fire Mario
        graphics.fillStyle(0xff0000)
        graphics.fillRect(10, 2, 12, 6)
        graphics.fillStyle(0xcc0000)
        graphics.fillRect(8, 6, 16, 4)
        graphics.fillStyle(0xffcc99)
        graphics.fillRect(10, 10, 12, 8)
        graphics.fillStyle(0x000000)
        graphics.fillRect(14, 14, 2, 4)
        graphics.fillRect(18, 14, 2, 4)
        graphics.fillRect(10, 20, 12, 4)
        graphics.fillStyle(0xff6600)
        graphics.fillRect(10, 24, 12, 14)
        graphics.fillStyle(0xffff00)
        graphics.fillRect(10, 24, 2, 12)
        graphics.fillStyle(0xff0000)
        graphics.fillRect(8, 26, 4, 8)
        graphics.fillRect(20, 26, 4, 8)
        graphics.fillStyle(0xffcc00)
        graphics.fillRect(14, 26, 2, 2)
        graphics.fillRect(14, 30, 2, 2)
        graphics.fillRect(14, 34, 2, 2)
        graphics.fillStyle(0x8b4513)
        graphics.fillRect(8, 38, 6, 4)
        graphics.fillRect(18, 38, 6, 4)

        graphics.generateTexture('playerFire', 32, 42)
        graphics.destroy()
      }

      createGoombaTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0x8b4513)
        g.fillRect(4, 4, 24, 20)
        g.fillStyle(0x5a2d0c)
        g.fillRect(2, 22, 10, 8)
        g.fillRect(20, 22, 10, 8)
        g.fillStyle(0x000000)
        g.fillRect(8, 10, 6, 8)
        g.fillRect(18, 10, 6, 8)
        g.generateTexture('goomba', 32, 30)
        g.destroy()
      }

      createCoinTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xffd700)
        g.fillCircle(12, 12, 10)
        g.fillStyle(0xffaa00)
        g.fillCircle(12, 12, 8)
        g.fillStyle(0xffff00)
        g.fillCircle(10, 10, 3)
        g.fillRect(10, 6, 4, 12)
        g.fillRect(6, 10, 12, 4)
        g.generateTexture('coin', 24, 24)
        g.destroy()
      }

      createMushroomTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xff0000)
        g.fillCircle(16, 12, 14)
        g.fillStyle(0xffffff)
        g.fillCircle(10, 6, 3)
        g.fillCircle(22, 6, 3)
        g.fillCircle(8, 14, 2)
        g.fillCircle(24, 14, 2)
        g.fillCircle(16, 18, 2)
        g.fillStyle(0xffffff)
        g.fillRect(10, 22, 12, 12)
        g.fillStyle(0xcccccc)
        g.fillRect(10, 22, 4, 12)
        g.generateTexture('mushroom', 32, 34)
        g.destroy()
      }

      createFlowerTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xffaa00)
        g.fillCircle(16, 16, 8)
        g.fillStyle(0xffff00)
        g.fillCircle(8, 8, 6)
        g.fillCircle(24, 8, 6)
        g.fillCircle(8, 24, 6)
        g.fillCircle(24, 24, 6)
        g.fillCircle(16, 6, 6)
        g.fillCircle(16, 26, 6)
        g.fillCircle(6, 16, 6)
        g.fillCircle(26, 16, 6)
        g.fillStyle(0x00aa00)
        g.fillRect(14, 26, 4, 10)
        g.generateTexture('flower', 32, 36)
        g.destroy()
      }

      createBrickTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xcc6600)
        g.fillRect(0, 0, 32, 32)
        g.fillStyle(0x994400)
        g.fillRect(0, 0, 32, 2)
        g.fillRect(0, 10, 32, 2)
        g.fillRect(0, 20, 32, 2)
        g.fillRect(0, 30, 32, 2)
        g.fillRect(8, 0, 2, 10)
        g.fillRect(8, 12, 2, 8)
        g.fillRect(22, 0, 2, 10)
        g.fillRect(22, 12, 2, 8)
        g.generateTexture('brick', 32, 32)
        g.destroy()
      }

      createQuestionBlockTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xffaa00)
        g.fillRect(0, 0, 32, 32)
        g.fillStyle(0xff8800)
        g.fillRect(0, 0, 32, 4)
        g.fillRect(0, 0, 4, 32)
        g.fillRect(28, 0, 4, 32)
        g.fillRect(0, 28, 32, 4)
        g.fillStyle(0xffcc00)
        g.fillRect(4, 4, 24, 24)
        g.fillStyle(0x994400)
        g.fillRect(10, 8, 2, 4)
        g.fillRect(10, 8, 8, 2)
        g.fillRect(16, 8, 2, 8)
        g.fillRect(10, 16, 8, 2)
        g.fillRect(14, 18, 4, 2)
        g.generateTexture('question', 32, 32)
        g.destroy()
      }

      createPipeTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0x00aa00)
        g.fillRect(0, 0, 48, 60)
        g.fillStyle(0x00dd00)
        g.fillRect(4, 4, 40, 8)
        g.fillRect(4, 4, 8, 52)
        g.fillRect(36, 4, 8, 52)
        g.fillStyle(0x008800)
        g.fillRect(0, 0, 48, 4)
        g.fillRect(0, 0, 8, 60)
        g.fillRect(40, 0, 8, 60)
        g.fillRect(0, 56, 48, 4)
        g.generateTexture('pipe', 48, 60)
        g.destroy()
      }

      createGroundTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xc84c0c)
        g.fillRect(0, 0, 32, 32)
        g.fillStyle(0x8b3208)
        g.fillRect(0, 0, 32, 4)
        g.fillRect(0, 12, 32, 2)
        g.fillRect(0, 24, 32, 2)
        g.generateTexture('ground', 32, 32)
        g.destroy()
      }

      createHillTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0x228b22)
        g.fillTriangle(80, 60, 0, 60, 40, 0)
        g.fillStyle(0x32cd32)
        g.fillTriangle(80, 60, 30, 60, 55, 20)
        g.generateTexture('hill', 80, 60)
        g.destroy()
      }

      createCloudTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xffffff)
        g.fillCircle(20, 16, 16)
        g.fillCircle(36, 12, 14)
        g.fillCircle(52, 16, 16)
        g.fillCircle(28, 20, 14)
        g.fillCircle(44, 20, 14)
        g.generateTexture('cloud', 72, 36)
        g.destroy()
      }

      createStarTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        g.fillStyle(0xffff00)
        g.beginPath()
        g.moveTo(16, 0)
        g.lineTo(20, 12)
        g.lineTo(32, 12)
        g.lineTo(22, 20)
        g.lineTo(26, 32)
        g.lineTo(16, 24)
        g.lineTo(6, 32)
        g.lineTo(10, 20)
        g.lineTo(0, 12)
        g.lineTo(12, 12)
        g.closePath()
        g.fillPath()
        g.generateTexture('star', 32, 32)
        g.destroy()
      }

      create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
        this.createBackground()
        this.platforms = this.physics.add.staticGroup()
        this.createLevel()
        this.player = this.physics.add.sprite(100, 400, 'player')
        this.player.setBounce(0)
        this.player.setCollideWorldBounds(false)
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
        this.player.setCollideWorldBounds(true)
        this.player.body.onWorldBounds = true
        this.goombas = this.physics.add.group()
        this.createGoombas()
        this.coins = this.physics.add.group()
        this.createCoins()
        this.questionBlocks = this.physics.add.staticGroup()
        this.createQuestionBlocks()
        this.pipeGroup = this.physics.add.staticGroup()
        this.createPipes()
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.goombas, this.platforms)
        this.physics.add.collider(this.coins, this.platforms)
        this.physics.add.collider(this.questionBlocks, this.platforms)
        this.physics.add.collider(this.pipeGroup, this.platforms)
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)
        this.physics.add.overlap(this.player, this.goombas, this.hitGoomba, undefined, this)
        this.physics.add.collider(this.player, this.questionBlocks, this.hitQuestionBlock, undefined, this)
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.keyboard.on('keydown-SPACE', this.jump, this)
        this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
          fontSize: '24px',
          fontFamily: 'monospace',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4
        }).setScrollFactor(0).setDepth(100)
        this.livesText = this.add.text(600, 16, 'LIVES: 3', {
          fontSize: '24px',
          fontFamily: 'monospace',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4
        }).setScrollFactor(0).setDepth(100)
      }

      createBackground() {
        this.cameras.main.setBackgroundColor('#5c94fc')
        for (let i = 0; i < 20; i++) {
          const cloud = this.add.image(Phaser.Math.Between(0, WORLD_WIDTH), Phaser.Math.Between(40, 150), 'cloud')
          cloud.setAlpha(0.9)
          cloud.setScrollFactor(0.3)
        }
        for (let i = 0; i < 8; i++) {
          const hill = this.add.image(i * 400 + 100, 536, 'hill')
          hill.setScrollFactor(0.5)
          hill.setDepth(-10)
        }
      }

      createLevel() {
        for (let x = -64; x < WORLD_WIDTH + 64; x += 32) {
          this.platforms.create(x, 568, 'ground')
        }
        const levelStructure = [
          { x: 350, y: 450, w: 3 },
          { x: 500, y: 380, w: 2 },
          { x: 650, y: 320, w: 4 },
          { x: 850, y: 450, w: 2 },
          { x: 900, y: 400, w: 2 },
          { x: 950, y: 350, w: 2 },
          { x: 1000, y: 300, w: 2 },
          { x: 1200, y: 280, w: 3 },
          { x: 1450, y: 220, w: 2 },
          { x: 1650, y: 280, w: 4 },
          { x: 1900, y: 400, w: 2 },
          { x: 2050, y: 320, w: 3 },
          { x: 2200, y: 250, w: 2 },
          { x: 2400, y: 350, w: 3 },
          { x: 2600, y: 280, w: 4 },
          { x: 2800, y: 220, w: 2 },
        ]
        for (const p of levelStructure) {
          for (let i = 0; i < p.w; i++) {
            this.platforms.create(p.x + i * 32, p.y, 'brick')
          }
        }
      }

      createGoombas() {
        const positions = [400, 700, 1100, 1500, 1800, 2100, 2500, 2800]
        for (const x of positions) {
          const goomba = this.goombas.create(x, 500, 'goomba')
          goomba.setBounce(0.2)
          goomba.setCollideWorldBounds(true)
          goomba.setVelocityX(Phaser.Math.Between(-50, 50) || 50)
        }
      }

      createCoins() {
        const coinPositions = [
          { x: 350, y: 400 }, { x: 375, y: 400 }, { x: 400, y: 400 },
          { x: 500, y: 330 }, { x: 525, y: 330 },
          { x: 650, y: 270 }, { x: 675, y: 270 }, { x: 700, y: 270 },
          { x: 1200, y: 230 }, { x: 1225, y: 230 },
          { x: 1650, y: 230 }, { x: 1675, y: 230 }, { x: 1700, y: 230 },
          { x: 2050, y: 270 }, { x: 2075, y: 270 },
          { x: 2600, y: 230 }, { x: 2625, y: 230 }, { x: 2650, y: 230 },
        ]
        for (const pos of coinPositions) {
          const coin = this.coins.create(pos.x, pos.y, 'coin')
          coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4))
        }
      }

      createQuestionBlocks() {
        const blockPositions = [
          { x: 550, y: 440, content: 'mushroom' },
          { x: 750, y: 280, content: 'mushroom' },
          { x: 1000, y: 260, content: 'flower' },
          { x: 1200, y: 240, content: 'mushroom' },
          { x: 1450, y: 180, content: 'flower' },
          { x: 1900, y: 360, content: 'star' },
          { x: 2400, y: 310, content: 'mushroom' },
          { x: 2800, y: 180, content: 'flower' },
        ]
        for (const block of blockPositions) {
          const qb = this.questionBlocks.create(block.x, block.y, 'question')
          qb.setData('content', block.content)
          qb.setData('active', true)
        }
      }

      createPipes() {
        const pipePositions = [
          { x: 600, y: 536, h: 1 },
          { x: 850, y: 536, h: 2 },
          { x: 1350, y: 536, h: 1 },
          { x: 1750, y: 536, h: 2 },
          { x: 2200, y: 536, h: 1 },
          { x: 2750, y: 536, h: 2 },
        ]
        for (const p of pipePositions) {
          for (let i = 0; i < p.h; i++) {
            this.pipeGroup.create(p.x, p.y - i * 30, 'pipe')
          }
        }
      }

      jump() {
        if (this.gameOver) return
        if (this.player.body.touching.down) {
          this.player.setVelocityY(this.isBig ? BIG_JUMP_VELOCITY : JUMP_VELOCITY)
        }
      }

      collectCoin(coin: Phaser.Physics.Arcade.Sprite) {
        coin.disableBody(true, true)
        this.score += 100
        this.scoreText.setText('SCORE: ' + this.score)
      }

      hitGoomba(player: Phaser.Physics.Arcade.Sprite, goomba: Phaser.Physics.Arcade.Sprite) {
        if (player.body.velocity.y > 0 && player.y < goomba.y) {
          goomba.disableBody(true, true)
          player.setVelocityY(-300)
          this.score += 200
          this.scoreText.setText('SCORE: ' + this.score)
        } else if (!player.body.touching.down) {
          if (this.isBig) {
            this.becomeSmall()
          } else {
            this.playerDies()
          }
        }
      }

      hitQuestionBlock(player: Phaser.Physics.Arcade.Sprite, block: Phaser.Physics.Arcade.StaticBody) {
        if (player.body.velocity.y > 0 && player.y > block.y) {
          if (block.getData('active')) {
            block.setData('active', false)
            this.tweens.add({
              targets: block,
              y: block.y - 5,
              duration: 100,
              yoyo: true,
              repeat: 1
            })
            const content = block.getData('content')
            const spawnX = block.x
            const spawnY = block.y - 40
            let powerup
            if (content === 'mushroom') {
              powerup = this.physics.add.sprite(spawnX, spawnY, 'mushroom')
              powerup.setVelocityY(-200)
            } else if (content === 'flower') {
              powerup = this.physics.add.sprite(spawnX, spawnY, 'flower')
              powerup.setBounce(0.3)
            } else if (content === 'star') {
              powerup = this.physics.add.sprite(spawnX, spawnY, 'star')
              powerup.setBounce(0.5)
              powerup.setVelocityX(100)
            }
            if (powerup) {
              powerup.setCollideWorldBounds(true)
              powerup.setBounce(0.2)
              this.physics.add.collider(powerup, this.platforms)
              this.physics.add.overlap(player, powerup, this.collectPowerup, undefined, this)
            }
          }
        }
      }

      collectPowerup(player: Phaser.Physics.Arcade.Sprite, powerup: Phaser.Physics.Arcade.Sprite) {
        const type = powerup.texture.key
        if (type === 'mushroom') {
          if (!this.isBig) this.becomeBig()
        } else if (type === 'flower') {
          this.becomeFire()
        } else if (type === 'star') {
          this.player.setTint(0xffff00)
          setTimeout(() => this.player.clearTint(), 5000)
        }
        powerup.disableBody(true, true)
        this.score += 500
        this.scoreText.setText('SCORE: ' + this.score)
      }

      becomeBig() {
        this.isBig = true
        this.player.setTexture('playerBig')
        this.player.body.setSize(32, 40)
        this.player.setOffset(0, -6)
        this.player.y -= 6
      }

      becomeFire() {
        this.isFire = true
        this.isBig = true
        this.player.setTexture('playerFire')
        this.player.body.setSize(32, 42)
        this.player.setOffset(0, -8)
      }

      becomeSmall() {
        this.isBig = false
        this.isFire = false
        this.player.setTexture('player')
        this.player.body.setSize(32, 34)
        this.player.setOffset(0, 0)
      }

      playerDies() {
        if (this.gameOver) return
        this.lives--
        this.livesText.setText('LIVES: ' + this.lives)
        if (this.lives <= 0) {
          this.gameOver = true
          this.player.setTint(0xff0000)
          this.add.text(300, 250, 'GAME OVER', {
            fontSize: '48px',
            fontFamily: 'monospace',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
          }).setScrollFactor(0).setDepth(200)
          setTimeout(() => this.scene.restart(), 3000)
        } else {
          this.becomeSmall()
          this.player.setPosition(100, 400)
          this.player.setVelocity(0, 0)
          this.player.setTint(0xff0000)
          setTimeout(() => this.player.clearTint(), 2000)
        }
      }

      update() {
        if (this.gameOver) return
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-PLAYER_SPEED)
          this.player.setFlipX(true)
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(PLAYER_SPEED)
          this.player.setFlipX(false)
        } else {
          this.player.setVelocityX(0)
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(this.isBig ? BIG_JUMP_VELOCITY : JUMP_VELOCITY)
        }
        if (this.player.x < 16) this.player.x = 16
        if (this.player.y > 600) {
          this.playerDies()
        }
        this.goombas.children.each((goomba) => {
          const g = goomba as Phaser.Physics.Arcade.Sprite
          if (g.active) {
            if (g.body.touching.right || g.body.blocked.right) {
              g.setVelocityX(-50)
              g.setFlipX(true)
            } else if (g.body.touching.left || g.body.blocked.left) {
              g.setVelocityX(50)
              g.setFlipX(false)
            }
            if (g.body.velocity.x === 0) {
              g.setVelocityX(Phaser.Math.Between(-50, 50) || 50)
            }
          }
        })
      }
    }
    