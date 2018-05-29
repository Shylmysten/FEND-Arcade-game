let score = 0;
let livesLeft = 3;

// create a div to place our score and lives in
const infoBar = document.createElement('div');
// set the class for this div to "infoBar"
infoBar.setAttribute('class', 'infoBar');
// create a div to place our "life" count into
const pHealth = document.createElement('div');
// set the class for this div to 'health'
pHealth.setAttribute('class', 'health');
// now lets put the heart icons that represent our lives into a span called lives.
pHealth.innerHTML = '<p>LIVES:<span id="lives"><img class="hearts" src="images/Heart2.png"><img class="hearts" src="images/Heart2.png"><img class="hearts" src="images/Heart2.png"></span></p>';
// create a div for our score and place it into a variable called pScore
const pScore = document.createElement('div');
// set the class of this div to 'score'
pScore.setAttribute('class', 'score');
// now lets place a score of 000000 into a span with the id of 'score'
pScore.innerHTML = '<p>SCORE:<span type="number" id="score">000000</span></p>';
// append the health div to the infobar div
infoBar.appendChild(pHealth);
// append the div that hold our score into the infoBar
infoBar.appendChild(pScore);
// now lets append the info bar to our body
document.body.appendChild(infoBar);
// select the span that hold our heart icons
const heartElements = document.getElementById('lives');
// select the span that holds our actual score
const uiScore = document.getElementById('score');

// Taking cues from the engine.js with updateEntities, let create a superClass
// called entities which we will then subclass the player and enemies from
class Entities {
    constructor(x,y) {
        // the image
        this.sprite = '';
        // x and y coords
        this.x = x;
        this.y = y;

        // offsets left inert transparent space in image itself
        this.sx = 0;
        // offsets top inert transparent space in image itself
        this.sy = 0;

        // actual width of sprite - inert transparencies (checkCollisions)
        this.sWidth = 0;
        // actual height of sprite - inert transparencies (checkCollisions)
        this.sHeight = 0;
        this.collisionSfx = new Audio('soundfx/cartoon-ouch-sound-effect-J0EbCeXN-clipped.mp3');
        this.lvlUpSfx = new Audio('soundfx/woo_hoo.mp3');
    }

}


Entities.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.sWidth, this.sHeight);
}

Entities.prototype.checkCollisions = function(x,y) {
    allEnemies.forEach((enemy) => {
        // Player's left side
        let pLeft = player.x;
        // Players right side
        let pRight = player.x + player.sWidth;
        // Players top
        let pTop = player.y;
        // Players bottom
        let pBottom = player.y + player.sHeight;
        // Enemies left side
        let eLeft = enemy.x;
        // Enemies right side
        let eRight = enemy.x + enemy.sWidth;
        // top of our enemy
        let eTop = enemy.y;
        // bottom of our enemy
        let eBottom = enemy.y + enemy.sHeight;

        // Set the conditions for an actual collision between a player and enemy
        if (((pTop <= eBottom)&&(pBottom-player.sx>=eTop)) && ((pLeft+player.sx <= eRight)&&(pRight-player.sx >= eLeft))) {
            // if there is a collission, play OUCH! sfx
            player.collisionSfx.play();

            // CHECK LIVES LEFT

            // if the player has no lives left
            if (livesLeft === 0) {
                // GAME OVER display modal
                // get and remove the low lives message displayed below canvas
                document.querySelector('canvas').nextSibling.remove();
                // hide the display while displaying the model
                document.querySelector('canvas').style.display = "none";
                // Select the modal
                let modal = document.getElementsByClassName('modal')[0];
                // Select the overlay behind the modal
                let overlay = document.getElementsByClassName('modal-overlay')[0];
                // select the h1 tag
                let header= document.getElementsByClassName('modal')[0].firstElementChild;
                // select the ptag after the h2 tag
                let message = header.nextElementSibling;
                // display the modal
                modal.style.display = "block";
                // display the overlay
                overlay.style.display = "block";
                // change the text of the header
                header.innerHTML = `GAME OVER BUDDY!`;
                // change the message body of the modal
                message.innerHTML = `<p>You finished with a score of ${score}!</p><p>GREAT JOB!!!</p><p>How about another game?</p>`;
            }
            // if lives left
            if (livesLeft <= 3 && livesLeft > 0) {
                // remove a life
                livesLeft -=1;
                heartElements.firstElementChild.remove();
                if (livesLeft === 0) {
                    document.getElementsByTagName('canvas')[0].insertAdjacentHTML('afterEnd', "<p class='warning'>Careful, You Don't Have Any Lives Left To Spare!</p>");

                }
            }
            // reset character position
            player.x = 220;
            player.y = 469;
        }
    });

}


// Enemies our player must avoid
class Enemy extends Entities {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    constructor(x,y) {
        super(x,y);
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        // offsets left inert transparent space in image itself
        this.sx = 1;
        // offsets top inert transparent space in image itself
        this.sy = 77;
        // actual width of sprite - inert transparencies (checkCollisions)
        this.sWidth = 98;
        // actual height of sprite - inert transparencies (checkCollisions)
        this.sHeight = 77;
        // randomly set the speed of each enemy
        this.speed = Math.floor(Math.random() * 3) + 1;
    }


};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Set the speed of enemy individually
    this.x += (this.speed*65)*dt;

        // instead of just placing the enemy back at the left side of the screen
        // lets remove that bug and create an entirely new enemy with a
        // different speed, and starting location on the canvas to make it
        // harder

        // if an enemy leaves the canvas_right
       if (this.x > ctx.canvas.width) {
           // loop through the enemies
         allEnemies.forEach((enemy, idx) => {
             // determine which enemy in the array left the canvas
             if (this === enemy) {
                 // remove this enemy from the array
                 allEnemies.splice(idx,1);


                 // Then Let's make and entirely new enemy

                 // randomly select a number between 1 and 3 to determine row placement
                 let pickARow = (() => Math.floor(Math.random() * 3) + 1)();
                 // determines Y coordinate according to what row was selected in pickARow
                 this.y = (pickARow === 1? 135:pickARow===2?219:pickARow===3?303:null);
                 // Make an entirely new enemy with these coords
                 enemy = new Enemy(x=-100,this.y);


                 // add this new enemy to the array where we removed the old
                 // enemy
                 allEnemies.splice( idx, 0, enemy);
             }
         });
       }

};

Enemy.prototype.makeNewEnemy = function() {
    //randomly select where off screen to start the bug
    this.x = Math.floor(Math.random() * -100) - 100;
    // randomly select a number between 1 and 3 to randomly determine row placement
    let pickARow = (() => Math.floor(Math.random() * 3) + 1)();
    // determines Y coordinate according to what row was selected in pickARow
    this.y = (pickARow === 1? 135:pickARow===2?219:pickARow===3?303:null);
    // create a new enemy with these x and y coords
    enemy = new Enemy(this.x,this.y);
    // add this enemy to our enemy array
    allEnemies.push(enemy);
};


// Place all enemy objects in an array called allEnemies
const  allEnemies = [];
// Randomly create 3 enemies and push them into the allEnemies array
  for(var i=1; i< 4; i++) {
      //randomly select where off screen to start the bug
      this.x = Math.floor(Math.random() * -100) - 100;
      // randomly select a number between 1 and 3 to randomly determine row placement
      let pickARow = (() => Math.floor(Math.random() * 3) + 1)();
      // determines Y coordinate according to what row was selected in pickARow
      this.y = (pickARow === 1? 135:pickARow===2?219:pickARow===3?303:null);
      // create a new enemy with these x and y coords
      enemy = new Enemy(this.x,this.y);
      // add this enemy to our enemy array
      allEnemies.push(enemy);
  }



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Our player
class Player extends Entities {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    constructor(sprite = 'images/char-boy.png', x= 220, y=469) {
        super();
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = sprite;

        // Characters Location information
        this.x = x; // collision left is x coordinate
        this.y = y; // collision top is Y coordinate


        // position image
        this.sx = 17; // offsets left inert transparent space in image itself
        this.sy = 63; // offsets top inert transparent space in image itself
        this.sWidth = 67; // actual width of sprite - inert transparencies
        this.sHeight = 88; // actual height of sprite - inert transparencies

        this.lvl = 1; // Game levels player has completed
    }

};

Player.prototype.levelup = function () {
    // if the player reaches the water
    if (player.y <= 50) {
        // increment player level
        player.lvl += 1;
        // reset player to bottom of the board
        this.x = 220;
        this.y = 469;
        // increment player score
        score += 1000;
        // display the score in the UI
        uiScore.innerText = score;
        // Play lvlUp sfx
        player.lvlUpSfx.play();
        // to increase difficulty level, place another enemy on the board
        enemy.makeNewEnemy();
    }
}

// Update the Player's position, required method for game
Player.prototype.update = function() {
        // check if the player reached the water
        player.levelup();
        // check for collisions between the player and the enemy
        player.checkCollisions(this.x, this.y);
}


Player.prototype.handleInput = function(e) {
        if (e === "left") {
            // move the player left if they haven't reached the left boundary
            ((this.x - 101) < 0) ? null: this.x = this.x - 101;
        }
        if (e === "right") {
            // move the player right if they haven't reached the right boundary
            ((this.x + 101) > 422) ? null: this.x = this.x + 101;
        }


        if (e === "up") {
            // move the player up unless they have reached the top boundary
            ((this.y - 83) < 50) ? null:this.y = this.y - 84;
        }
        if (e === "down") {
            // move the player down unless they are at the bottom boundary
            ((this.y + 83) > 489) ? null:this.y = this.y + 84;
        }

}

// Now instantiate your objects.

// Place the player object in a variable called player
const player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (!(e.keyCode in allowedKeys)) {
        return;
    }

    player.handleInput(allowedKeys[e.keyCode]);

});

// setup evenlisteners for buttons on the modal
document.querySelector('.modal').addEventListener('click', function(e) {
    if (e.target.matches('button#reset')) {
        // just reload the page on play again or close. (simple reset)
        location.reload();
    }
    if (e.target.matches('button#close')) {
        self.close();
    }
})
