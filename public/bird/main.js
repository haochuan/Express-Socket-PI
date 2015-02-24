var socket = io.connect();


// width and height

var width = window.innerWidth;
var height = window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div'); // 320, 548

// Creates a new 'main' state that wil contain the game
var main_state = {

    preload: function() { 
		// Function called first to load all the assets

		// Background 
		game.stage.backgroundColor = '#71c5cf';

		// Haochuan
        game.load.spritesheet('haochuan', 'assets/haochuan.png',  50, 50, 4);

		// Pipes
		game.load.image('pipe', 'assets/pipe.png');

        // sound
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('die', 'assets/die.wav');


    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // touch event on ios

        game.input.addPointer();


        // if(this.game.device.desktop === false) {
        //     this.game.stage.scale.startFullScreen();
        // }
    	// Fuction called after 'preload' to setup the game    

    	// Display Haochuan
    	this.haochuan = this.game.add.sprite(30, height / 2 - 50, 'haochuan', 0);

    	// Gravity
        game.physics.arcade.enable(this.haochuan); // 
    	this.haochuan.body.gravity.y = 1200;

        // timer

    	this.timer = this.game.time.events.loop(1600, this.add_row_of_pipes, this);  

    	// Jump function
    	this.space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.space_key.onDown.add(this.jump, this);  
        this.jump_sound = this.game.add.audio('jump');  

    	// Pipe
    	this.pipes = game.add.group();
        this.pipes.enableBody = true;
    	this.pipes.createMultiple(width / 20, 'pipe');
		
        // scores
        this.pipeNumber = 0;
        this.score = 0;  
		var style = { font: "30px Arial", fill: "#ffffff" };  
		this.label_score = this.game.add.text(20, 20, "0", style); 

        // touch on mobile
        game.input.onTap.add(this.jump, this);

        //die
        this.die_sound = this.game.add.audio('die');  
    },
    
    add_one_pipe: function(x, y) {
            var pipe = this.pipes.getFirstDead();
            // set new position for the pipe
            pipe.reset(x, y);
            // add velocity to the pipe to move that to the left
            pipe.body.velocity.x = -(width / 2);
            // Kill teh pipe when it's no longer visible
            pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {  
    var hole = Math.floor(Math.random()*4)+1; // 1 to 5

    for (var i = 0; i < Math.floor(height / 70); i++)
        if (i != hole && i != hole +1) 
            this.add_one_pipe(width, i*80); 
    this.pipeNumber += 1;  
    if(this.pipeNumber > 1)
        this.score += 1;  
        this.label_score.content = this.score;   
    }, 

    //jump
    jump: function() {  
        // Add a vertical velocity to haochuan
            if (this.haochuan.alive === false)  
        return; 
        this.haochuan.loadTexture('haochuan', 2);
        this.jump_sound.play();  
        this.haochuan.body.velocity.y = -400;
    },
    
    update: function() {
		// Function called 60 times per second
        
        // jump animation

        if(!this.space_key.isDown) {
            this.haochuan.loadTexture('haochuan', 0);
        }

        if(this.space_key.isDown) {
            this.haochuan.loadTexture('haochuan', 2);
        }

        if(this.game.input.pointer1.isUp && !this.space_key.isDown) {
            this.haochuan.loadTexture('haochuan', 0);
        }

        if(this.game.input.pointer1.isDown) {
            this.haochuan.loadTexture('haochuan', 2);
        }

		// haochuan is out of the world
		if(this.haochuan.inWorld === false) {
            this.hit_pipe();
		}

        // win
        // if(this.score >= 2) {
        //     this.game_win();
        // }

		// dead
        if(!this.haochuan.alive) {
            this.haochuan.loadTexture('haochuan', 3);
            if(this.space_key.isDown || this.game.input.pointer1.isDown) {
                this.restart_game();
            }
        }

        game.physics.arcade.overlap(this.haochuan, this.pipes, this.hit_pipe, null, this);
    },
    // game_win: function() {
    //     this.haochuan.win = true;
    //     // Prevent new pipes from appearing
    //     this.game.time.events.remove(this.timer);

    //     // Go through all the pipes, and stop their movement
    //     this.pipes.forEachAlive(function(p){ 
    //         p.body.velocity.x = 0;
    //     }, this);

    //     this.label_text = this.game.add.text(width / 2 - 84, 100, "You're the best!", { font: "30px Arial", fill: "#ffffff" }); 
    //     this.label_text = this.game.add.text(width / 2 - 140, 150, "Try to play on small device", { font: "30px Arial", fill: "#ffffff" }); 
    //     this.label_text = this.game.add.text(width / 2 - 56, 200, "or resize your browser then refresh", { font: "30px Arial", fill: "#ffffff" }); 
    //     this.label_text = this.game.add.text(width / 2 - 84, 250, "It will be harder!", { font: "30px Arial", fill: "#ffffff" }); 
    //     this.label_text = this.game.add.text(width / 2 - 84, 300, "Press Space", { font: "30px Arial", fill: "#ffffff" }); 
    //     this.label_text = this.game.add.text(width / 2 - 140, 350, "or Tap on the Screen", { font: "30px Arial", fill: "#ffffff" }); 
    //     this.label_text = this.game.add.text(width / 2 - 56, 400, "to restart.", { font: "30px Arial", fill: "#ffffff" });  
    //     if(this.space_key.isDown || this.game.input.pointer1.isDown) {
    //         this.restart_game();
    //     }        
    // },
    hit_pipe: function() {  
        // If the haochuan has already hit a pipe, we have nothing to do
        if (this.haochuan.alive == false)
            return;

        // Set the alive property of the haochuan to false
        this.haochuan.alive = false;

        // Prevent new pipes from appearing
        this.die_sound.play(); 
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){ 
            p.body.velocity.x = 0;
        }, this);
        this.label_text = this.game.add.text(width / 2 - 84, 80, "Press Space", { font: "30px Arial", fill: "#ffffff" }); 
        this.label_text = this.game.add.text(width / 2 - 140, 120, "or Tap on the Screen", { font: "30px Arial", fill: "#ffffff" }); 
        this.label_text = this.game.add.text(width / 2 - 60, 160, "to restart.", { font: "30px Arial", fill: "#ffffff" }); 
        this.label_text = this.game.add.text(width / 2 - 150, 220, "Try on different device", { font: "30px Arial", fill: "#ffffff" }); 
        this.label_text = this.game.add.text(width / 2 - 150, 260, "or resize your browser", { font: "30px Arial", fill: "#ffffff" }); 
        this.label_text = this.game.add.text(width / 2 - 80, 300, "then refresh", { font: "30px Arial", fill: "#ffffff" }); 
        this.label_text = this.game.add.text(width / 2 - 120, 340, "It will be different!", { font: "30px Arial", fill: "#ffffff" });
    },
    restart_game: function() {
        this.haochuan.win = false;
        this.game.time.events.remove(this.timer);  
        this.game.state.start('main');
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 
socket.on('jump', main_state.jump());