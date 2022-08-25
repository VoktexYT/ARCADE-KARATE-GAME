class Main extends Phaser.Scene {
    constructor() {
        super('main')
    }

    SYS_setCursor(types) {
        game.canvas.style.cursor = types;
    }

    SYS_randint(min, max) {
        return Math.random() * (max - min) + min;
    }

    SYS_find(action_name) {
        find: {
            for (let action of this.action_used) {
                if (action == action_name) {
                    break find; 
                }
            }
            this.action = action_name;
            this.action_used.push(this.action)
        }
    }

    SYS_activeImage(type, person) {
        if (person) {
            for (let el of [this.iddlePlayer, this.attackPlayer, this.shieldPlayer]) {
                el.setVisible(false);
            }
        }
        else {
            for (let el of [this.iddleEnemy, this.attackEnemy, this.shieldEnemy]) {
                el.setVisible(false);
            }
        }
        

        if (type == 'iddle') {
            if (person) {
                this.iddlePlayer.setVisible(true);
                this.iddlePlayer.anims.play('iddlePlayer');
            }
            else {
                this.iddleEnemy.setVisible(true);
                this.iddleEnemy.anims.play('iddleEnemy');
            }
        }
        else if (type == 'attack') {
            if (person) {
                this.attackPlayer.setVisible(true);
                this.attackPlayer.anims.play('attackPlayer');
            }
            else {
                this.attackEnemy.setVisible(true);
                this.attackEnemy.anims.play('attackEnemy');
            }
        }
        else if (type == 'shield') {
            if (person) {
                this.shieldPlayer.setVisible(true);
                this.shieldPlayer.anims.play('shieldPlayer')
            }
            else {
                this.shieldEnemy.setVisible(true);
                this.shieldEnemy.anims.play('shieldEnemy')
            }
        }
    }


    SYS_enemyActionUsed() {
        let action = [];
        let action_avaible = ['iddle', 'attack', 'shield']

        for (let i=0; i<3; i++) {
            let choise = action_avaible[Math.floor(Math.random() * action_avaible.length)]
            action_avaible.splice(action_avaible.indexOf(choise), 1)
            action.push(choise);
        }
        return action
    }

    preload() {
        this.load.audio('audio:music', 'music/play-again-classic-arcade-game-116820.mp3');
        this.load.audio('audio:impact', 'music/vibrating-thud-39536.mp3');

        this.load.spritesheet('spritesheet:iddle', 'assets/Iddle-170x300.png', {frameWidth: 170, frameHeight: 300})
        this.load.spritesheet('spritesheet:attack', 'assets/attack-340x300.png', {frameWidth: 340, frameHeight: 300})
        this.load.spritesheet('spritesheet:shield', 'assets/protection-340x300.png', {frameWidth: 170, frameHeight: 300})

        this.load.spritesheet('spritesheet:icon', 'assets/icon.png', {frameWidth: 90, frameHeight: 90})
        this.load.spritesheet('spritesheet:btn', 'assets/btn.png', {frameWidth: 130, frameHeight: 130})
        this.load.spritesheet('spritesheet:background', 'assets/background-700x1560.png', {frameWidth: 700, frameHeight: 1560})
    }

    create() {
        // ----- sound ~ music ----- //
        this.sound.add('audio:music', {volume: 0.5, loop: true}).play()
        this.impact = this.sound.add('audio:impact', {volume: 1, loop: false})

        this.idx = 0;
        this.action = '';
        this.action_used = [];
        this.startGame = false;
        this.endGame = false;

        this.playerHealth = 100;
        this.enemyHealth = 100;

        this.enemyAction_used = this.SYS_enemyActionUsed()

        // ----- [SPRITESHEET] ----- //
        this.background = this.physics.add.sprite(0, 0, 'spritesheet:background', 0).setOrigin(0, 0);
        
        this.iddlePlayer = this.physics.add.sprite(200, 900, 'spritesheet:iddle', 0)
        this.attackPlayer = this.physics.add.sprite(300, 900, 'spritesheet:attack', 0).setVisible(false)
        this.shieldPlayer = this.physics.add.sprite(200, 900, 'spritesheet:shield', 0).setVisible(false)

        this.iddleEnemy = this.physics.add.sprite(500, 900, 'spritesheet:iddle', 2)
        this.attackEnemy = this.physics.add.sprite(400, 900, 'spritesheet:attack', 0).setVisible(false)
        this.shieldEnemy = this.physics.add.sprite(500, 900, 'spritesheet:shield', 0).setVisible(false)

        this.iddleEnemy.flipX = true;
        this.shieldEnemy.flipX = true;

        // ----- [IMAGE] ----- //
        this.btn1 = this.physics.add.sprite(60, 1200, 'spritesheet:btn', 0).setOrigin(0, 0);
        this.btn2 = this.physics.add.sprite(285, 1200, 'spritesheet:btn', 1).setOrigin(0, 0);
        this.btn3 = this.physics.add.sprite(510, 1200, 'spritesheet:btn', 2).setOrigin(0, 0);

        this.icon1 = this.physics.add.sprite(-100, -100, 'spritesheet:icon', 0)
        this.icon2 = this.physics.add.sprite(-100, -100, 'spritesheet:icon', 1)
        this.icon3 = this.physics.add.sprite(-100, -100, 'spritesheet:icon', 2)

        // ----- [TEXT] ----- //
        this.textHelathPlayer = this.add.text(100, 70, '100', {fontSize: 80, fontFamily: 'pixelMoney'}).setTint(0xcc3495)
        this.textHelathEnemy = this.add.text(400, 70, '100', {fontSize: 80, fontFamily: 'pixelMoney'}).setTint(0x6b1fb1)
        this.winText = this.add.text(50, 600, '', {fontSize: 80, fontFamily: 'pixelMoney'})

        // ----- [ANIMATION] ----- //
        this.anims.create({
            key: 'iddleBackground',
            frames: this.anims.generateFrameNumbers('spritesheet:background', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'iddlePlayer',
            frames: this.anims.generateFrameNumbers('spritesheet:iddle', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'attackPlayer',
            frames: this.anims.generateFrameNumbers('spritesheet:attack', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: 0
        });

        this.anims.create({
            key: 'shieldPlayer',
            frames: this.anims.generateFrameNumbers('spritesheet:shield', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'iddleEnemy',
            frames: this.anims.generateFrameNumbers('spritesheet:iddle', { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'attackEnemy',
            frames: this.anims.generateFrameNumbers('spritesheet:attack', { start: 4, end: 7 }),
            frameRate: 7,
            repeat: 0
        });

        this.anims.create({
            key: 'shieldEnemy',
            frames: this.anims.generateFrameNumbers('spritesheet:shield', { start: 3, end: 5 }),
            frameRate: 5,
            repeat: 0
        });

        this.background.anims.play('iddleBackground');

        this.iddlePlayer.anims.play('iddlePlayer');
        this.iddleEnemy.anims.play('iddleEnemy');

        // ----- [EVENT] ----- //
        for (let btn of [this.btn1, this.btn2, this.btn3]) {
            btn.setInteractive().on('pointerover', () => {
                this.SYS_setCursor('pointer');
                btn.setTint(0xFFFF00);
            });
            btn.setInteractive().on('pointerout', () => {
                this.SYS_setCursor('default')
                btn.setTint(0xFFFFFF);
            });
        }

        this.btn1.setInteractive().on('pointerdown', () => {
            this.SYS_find('attack');
        });
        this.btn2.setInteractive().on('pointerdown', () => {
            this.SYS_find('shield');
        });
        this.btn3.setInteractive().on('pointerdown', () => {
            this.SYS_find('none');
        });
    }

    update() {
        if (this.action != '') {
            if (this.action == 'attack') {
                this.icon1.setPosition(this.idx*170+200, 1430);
            }
            else if (this.action == 'shield') {
                this.icon2.setPosition(this.idx*170+200, 1430)
            }
            else {
                this.icon3.setPosition(this.idx*170+200, 1430)
            }
            this.action = '';
            this.idx += 1;
        }
        
        if (this.action_used.length === 3 && !this.startGame) {
            this.startGame = true;
            setTimeout(() => {
                for (let i=0; i<3; i++) {
                    if (this.action_used[i] == 'attack') {
                        setTimeout(() => {  
                            this.icon1.setPosition(-100, -100);
                            this.SYS_activeImage('attack', true);
                            setTimeout(() => {
                                if (this.enemyAction_used[i] != 'shield') {
                                    this.impact.play()
                                    if (this.enemyHealth - 20 <= 0) {
                                        this.endGame = true;
                                        this.winText.text = 'You are won'
                                        this.textHelathEnemy.text = '0'
                                    }
                                    else {
                                        this.enemyHealth -= 20
                                        this.textHelathEnemy.text = this.enemyHealth.toString()
                                    }
                                }
                                this.SYS_activeImage('iddle', true);
                            }, 1000);
                        }, i * 2000);
                    }
                    else if (this.action_used[i] == 'none') {
                        setTimeout(() => {  
                            this.icon3.setPosition(-100, -100);
                            this.SYS_activeImage('iddle', true);
                        }, i * 2000)
                    }
                    else if (this.action_used[i] == 'shield') {
                        setTimeout(() => {  
                            this.icon2.setPosition(-100, -100);
                            this.SYS_activeImage('shield', true);
                            setTimeout(() => {
                                this.SYS_activeImage('iddle', true);
                            }, 1000);
                        }, i * 2000);
                    }
                    if (this.enemyAction_used[i] == 'attack') {
                        setTimeout(() => {  
                            this.SYS_activeImage('attack', false);
                            setTimeout(() => {
                                if (this.action_used[i] != 'shield') {
                                    this.impact.play()
                                    if (this.playerHealth - 20 <= 0) {
                                        this.endGame = true;
                                        this.winText.text = 'Game over'
                                        this.textHelathPlayer.text = '0'
                                    }
                                    else {
                                        this.playerHealth -= 20
                                        this.textHelathPlayer.text = this.playerHealth.toString();
                                    }
                                }
                                this.SYS_activeImage('iddle', false);
                            }, 1000);
                        }, i * 2000);
                    }
                    else if (this.enemyAction_used[i] == 'shield') {
                        setTimeout(() => {  
                            this.SYS_activeImage('shield', false);
                            setTimeout(() => {
                                this.SYS_activeImage('iddle', false);
                            }, 1000);
                        }, i * 2000);
                    }
                    else if (this.enemyAction_used[i] == 'none') {
                        setTimeout(() => {  
                            this.SYS_activeImage('iddle', false);
                        }, i * 2000)
                    }
                }

                setTimeout(() => {
                    if (!this.endGame) {
                        this.action_used = [];
                        this.enemyAction_used = this.SYS_enemyActionUsed();
                        this.idx = 0;
                        this.startGame = false;
                    }
                    
                }, 7000);
                
            }, 1000);
        }
    }
}