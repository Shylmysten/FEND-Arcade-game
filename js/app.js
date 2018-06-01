// Score and livesLeft keep track of players lives available and points scored
// Gems and keys keep track of how many the player collects during gameplay
const gameData = {
    score: 0,
    livesLeft: 3,
    gems: 0,
    key: 0
};

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
// create a dive for our sfx controls
const sfxControls = document.createElement('div');
// give it a class attribute and set it to muted
sfxControls.setAttribute('class', 'muted');
/***** Attribution:
Artist: YDoop
Song: Splash
Download/Stream: https://audiograb.com/HqL3mzLp */
const bgMusic = new Audio('soundfx/splash-HqL3mzLp2.mp3');
// set background music volume to 45%
bgMusic.volume = 0.45;
// autoloop background music
bgMusic.loop = true;


// append the health div to the infobar div
infoBar.appendChild(pHealth);
// append the div that hold our score into the infoBar
infoBar.appendChild(pScore);

infoBar.appendChild(sfxControls);
// now lets append the info bar to our body
document.body.appendChild(infoBar);
// select the span that hold our heart icons
const heartElements = document.getElementById('lives');
// select the span that holds our actual score
const uiScore = document.getElementById('score');

// Taking cues from the engine.js with updateEntities, let create a superClass
// called entities which we will then subclass the player and enemies from
class Entities {
    // The super class from which all "entity" classes are based.
    // Doesn't make a lot of sense, but the rubric said we had to build class
    // and subclasses. Here is my superClass.
    constructor(x,y) {
        // x and y coords
        this.x = x;
        this.y = y;
    }

}


Entities.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.sWidth, this.sHeight);
};

//@@ Prototypical method which provied logic for collisions between
// Player and enemies
Entities.prototype.checkCollisions = function(x,y) {
    // Player's left side
    let pLeft = player.x;
    // Players right side
    let pRight = player.x + player.sWidth;
    // Players top
    let pTop = player.y;
    // Players bottom
    let pBottom = player.y + player.sHeight;

    allEnemies.forEach((enemy) => {
        // Enemies left side
        let eLeft = enemy.x;
        // Enemies right side
        let eRight = enemy.x + enemy.sWidth;
        // top of our enemy
        let eTop = enemy.y;
        // bottom of our enemy (-31 removes the shadow so its a real collision)
        let eBottom = (enemy.y + enemy.sHeight) - 31;

        // Set the conditions for an actual collision between a player and enemy
        if (((pTop <= eBottom)&&(pBottom-player.sx>=eTop)) && ((pLeft+player.sx <= eRight)&&(pRight-player.sx >= eLeft))) {
            // if there is a collission, play OUCH! sfx
            player.collisionSfx.play();

            // CHECK LIVES LEFT

            // if the player has no lives left
            if (gameData.livesLeft === 0) {
                // GAME OVER display modal
                bgMusic.pause();
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
                header.innerHTML = `GAME OVER!`;
                // change the message body of the modal
                message.innerHTML = `
                <p>Nice Job Champ!</p>
                <p>You reached <strong>Level ${this.lvl}</strong>, collecting <strong>${gameData.gems} gems</strong> and <strong>${gameData.key} keys</strong> along the way, scoring a total of <strong>${gameData.score} points</strong>!!!</p>
                <p>You're a Regular Hero!!!</p>
                <p>How about another game?</p>`;
            }
            // if lives left

            if (gameData.livesLeft > 0) {
                // remove a life
                gameData.livesLeft -= 1;
                // remove one heart image from the UI
                heartElements.removeChild(heartElements.firstElementChild);


                // display a "warning" when the Player reaches their last life
                if (gameData.livesLeft === 1) {
                    document.getElementsByTagName('canvas')[0].insertAdjacentHTML('afterEnd', "<p class='warning'>Careful, You Don't Have Any Lives Left To Spare!</p>");
                }
            }

            // reset Player pixel back to its starting position
            player.x = 220;
            player.y = 469;
        }
    });

    treasure.forEach((loot,idx) => {
        // Treasure left side
        let tLeft = loot.x;
        // Trasure right side
        let tRight = loot.x + loot.dWidth;
        // top of our treasure
        let tTop = loot.y;
        // bottom of our treasure
        let tBottom = loot.y + loot.dHeight;

        // Set the conditions for a collision between a player and Treasure
        if (((pTop <= tBottom)&&(pBottom-player.sx>=tTop)) && ((pLeft+player.sx <= tRight)&&(pRight-player.sx >= tLeft))) {
            // if the loot is a Gem
            if (loot.sprite.includes('Gem')) {
                // play the gem SFX
                loot.getGemSfx.play();
                // update how many gems have been picked up
                gameData.gems += 1;
                // increment our player's score
                gameData.score += 250;
                // update the score in the UI
                uiScore.innerText = gameData.score;
            }
            // if the loot is a Key
            if (loot.sprite.includes('Key')) {
                // play the key SFX
                loot.getKeySfx.play();
                // update how many keys have been picked up
                gameData.key += 1;
                // increment our player's score
                gameData.score += 750;
                // update the score in the UI
                uiScore.innerText = gameData.score;
            }
            // if the loot is a heart
            if (loot.sprite.includes('Heart')) {
                // play the extraLife SFX
                loot.extraLifeSfx.play();
                // increment how many lives the player has left
                gameData.livesLeft +=1;
                // create a new img element and store it in gainLife
                let gainLife = document.createElement('img');
                // give this new element a class attribute and set it to hearts
                gainLife.setAttribute('class','hearts');
                // give this new element a src attribute and point to the sprite
                gainLife.setAttribute('src', 'images/Heart2.png');
                // append this new element to the element stored in
                // heartElements (<span.class.lives>)
                heartElements.appendChild(gainLife);
            }
            // we need to remove this element from the array now because it was
            // picked up by the player
             treasure.splice(idx,1);


        }

    });
};


// Enemies our player must avoid
class Enemy extends Entities {

    //@@ Enemy Constructor requires the starting x and y coords on the canvas
    //@@ as parameters
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
        this.speed = Math.floor(Math.random() * 3)+1.15;
    }


}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // Set the speed of enemy everytime the canvas updates
    this.x += (this.speed*65)*dt;


        // instead of just placing the enemy back at the left side of the screen
        // lets remove that bug and create an entirely new enemy with a
        // different speed, and starting location on the canvas just for giggles

        // if an enemy leaves the canvas_right
       if (this.x > ctx.canvas.width) {
           // loop through the enemies
         allEnemies.forEach((enemy, idx) => {
             // determine which enemy in the array left the canvas
             if (this === enemy) {
                 // Then remove this enemy from the array
                 allEnemies.splice(idx,1);
                 // Now Let's make an entirely new enemy :D
                 Enemy.prototype.makeNewEnemy();

             }
         });
       }

};

// Prototypical method that allows us to make a new enemy everytime the Player
// levels up OR leaves the canvas-->right, increasing the difficulty level
Enemy.prototype.makeNewEnemy = function() {
    let enemyRows = [135,219,303];
    //randomly select where off screen to start the bug
    this.x = Math.floor(Math.random() * -50) - 100;
    // Select a number >= 0 and <= 2 to randomly determine row placement
    let pickARow = Math.floor(Math.random() * 3);
    // determines Y coordinate according to what row was selected in pickARow
    this.y = enemyRows[pickARow];
    //this.y = (pickARow === 1? 135:pickARow===2?219:pickARow===3?303:null);
    // create a new enemy with these x and y coords
    enemy = new Enemy(this.x,this.y);
    // add this enemy to our enemy array
    allEnemies.push(enemy);
};


// Place all enemy objects in an array called allEnemies
const  allEnemies = [];
// Create 2 enemies
  for(var i=1; i< 3; i++) {
      Enemy.prototype.makeNewEnemy();
  }



// Our player
class Player extends Entities {
    //@@ Player CONSTRUCTOR has 3 parameter defaults. The sprite, and starting
    //@@ x and y coords on the canvas
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

        /***** Attribution:
        Artist: SoundEffects
        Sfx: Cartoon Ouch Sound Effect
        Download/Stream: https://audiograb.com/J0EbCeXN
        Artist's twittter: https://twitter.com/AudioGrip
        Artist's GooglePlus: https://plus.google.com/u/0/+seandehler *****/
        this.collisionSfx = new Audio('soundfx/cartoon-ouch-sound-effect-J0EbCeXN-clipped.mp3');

    }

}

Player.prototype.levelup = function () {
    // if the player reaches the water
    if (player.y <= 50) {
        // increment player level
        player.lvl += 1;
        // reset player to bottom of the board
        this.x = 220;
        this.y = 469;
        // increment player score
        gameData.score += 1000;
        // display the score in the UI
        uiScore.innerText = gameData.score;
        Loot.prototype.createTreasure();
        //@@**** Attribution: https://sweetalert2.github.io/ *****//
        //@  This piece of code provides BLING in a simple modal alert
        //@  everytime the player reaches the water as a level up notice
        //@@**** Attribution: https://sweetalert2.github.io/ *****//
        swal({
            position: 'center',
            title: `Level ${this.lvl}`,
            showConfirmButton: false,
            width: 300,
            padding: '1em',
            timer: 750
            }).then((result) => {
            result.dismiss === swal.DismissReason.timer;
        });
        // ***** End Attribution *****//

        // to increase difficulty level, place another enemy on the board
        enemy.makeNewEnemy();
    }
};

// Player's update prototype
//@@ checks to see if the player reached the water and ployer/enemy collisions
Player.prototype.update = function() {
        // check if the player reached the water
        player.levelup();
        // check for collisions between the player and the enemy
        player.checkCollisions(this.x, this.y);
};


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

};

// Now instantiate your objects.

// Place the player object in a variable called player
const player = new Player();




class Loot extends Entities {

    // @@ TREASURE CONSTRUCTOR
    // @@ 11 parameters needed, all 9 for the canvats ctx.drawImage method,
    // @@ plus the x and y coords on the canvas

    constructor(sprite,x,y,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight) {
        super(x,y);
        // The image/sprite for our treasure, this uses
        // a helper udacity provided in engine.js to easily load images
        this.sprite = sprite;

        // Characters canvas Location
        this.x = x; // collision left is x coordinate
        this.y = y; // collision top is Y coordinate


        // source image info
        this.sx = sx; // offsets left inert transparent space in image itself
        this.sy = sy; // offsets top inert transparent space in image itself
        this.sWidth = sWidth; // actual width of sprite - inert transparencies
        this.sHeight = sHeight; // actual height of sprite - inert transparencies
        // info how/where to place image on canvas
        this.dx = dx; // destination xOffset
        this.dy = dy; // distination yOffset
        this.dWidth = dWidth; // width we want images to appear on canvas
        this.dHeight = dHeight; // height we want images to appear on canvas


        /***** Attribution: https://freesound.org/people/matiasromero/
        Creative Commons 0 license
        CC0 1.0 Universal (CC0 1.0)
        Public Domain Dedication
        Matias Romero can be found at http://matiasromero.deviantart.com */
        this.getGemSfx = new Audio('soundfx/36365__matiasromero__clareira-sininho.mp3');


        /**** Attribution: "Morten Barfod Søegaard, Little Robot Sound Factory", www.littlerobotsoundfactory.com
        The Little Robot Sound Factory sound effects and music are released on Zapsplat.com under the Creative Commons Attribution 4.0 International License: https://www.zapsplat.com/license-type/cc-attribution-4-0-international/
        */
        this.getKeySfx = new Audio ('soundfx/little_robot_sound_factory_fantasy_Pickup_Gold_02.mp3');


        // Attribution: Sound effects obtained from https://www.zapsplat.com
        // https://www.zapsplat.com/license-type/standard-license/
        this.extraLifeSfx = new Audio ('soundfx/zapsplat_multimedia_game_one_up_extra_life_005.mp3');
    }
}

// Method of Loot that randomly selects which loot to place on the game board
// This method uses an Array of Sprites, xCoords, yCoords, and also establishes
// each sprites implementation into the canvas's ctx method, given the standard
// 9 parameters
// @@ returns 11 parameters - all 9 used in the canvas ctx drawImage method
// PLUS each piece of loots x and y coords on the canvas
Loot.prototype.selectLoot= function() {
    // stores the paths to our treasure images
    const lootSprites = [
            'images/Gem Blue.png',
            'images/Gem Green.png',
            'images/Gem Orange.png',
            'images/Key.png',
            'images/Heart.png'
        ];

    // select a random piece of treasure (it's image)
    sprite = lootSprites[Math.floor(Math.random() * 5)];
    // stores available x coordinate locations for our treasure
    let xCoords = [18,119,220,321,422];
    // stores available y coordinate locations for our treasure
    let yCoords = [133,217,301];
    // selects a random x coordinate from our array
    x = xCoords[Math.floor(Math.random() * 5)];
    // selects a random y coordinate from our array
    y = yCoords[Math.floor(Math.random() * 3)];

    // since each image is different, we need to establish what the image is
    // in order to determine how we will place it onto the canvas

    // if our selecting treasure is a Gem
    if (sprite.includes('Gem')) {
        sx = 3;
        sy = 58;
        sWidth = 95;
        sHeight = 111;
        dx = x-5;
        dy = y;
        dWidth = 73;
        dHeight = 83;
    }
    // if our selected treasure is a Key
    if (sprite.includes('Key')) {
        sx = 0;
        sy = 57;
        sWidth = 76;
        sHeight = 129;
        dx = x;
        dy = y;
        dWidth = 54;
        dHeight = 83;
    }
    // if our selected treasure is a heart
    if (sprite.includes('Heart')) {
        sx = 7;
        sy = 48;
        sWidth = 90;
        sHeight = 90;
        dx = x+5;
        dy = y+15;
        dWidth = 50;
        dHeight = 50;
    }
    // return an array of 11 parameters, all 9 ctx.drawImage parameters and our
    // x and y coords where we want to place the treasure on the canvas
    return [sprite, x, y, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight];
};

// Our render prototype takes 9 parameters to draw the image on the canvas
Loot.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);
};

// an array to store all our Loot in :D
const  treasure = [];

// a method of Loot to create our individual treasure items
Loot.prototype.createTreasure = function () {
    // Randomly select number 1 or 2
    let num = (() => Math.floor(Math.random() * 2)+1)();

    // make sure there is never more than 2 pieces of treasure on the map
    if (treasure.length >= 2) {
        return;
    } else {
        num = num-treasure.length;
    }

    // Create 2 pieces of Loot
      for(var i=1; i<= num; i++) {
          // create a new piece of treasure from the 11 pieces of data returned
          // by the Loot.prototype.selectLoot() method
          let loot = new Loot(...Loot.prototype.selectLoot());

          // add this loot to our treasure array
          treasure.push(loot);

          // if loot occupies the same square
          if ((treasure[0].y === loot.y) && (treasure.length > 1)) {
              // remove this loot from the array
              treasure.pop();
              // decrement i in the for loop so we can create another one in a // different location
              i--;
          }
      }
};

Loot.prototype.createTreasure();



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

// setup eventlisteners for buttons on the modal
document.querySelector('.modal').addEventListener('click', function(e) {
    if (e.target.matches('button#reset')) {
        // just reload the page on play again (simple reset)
        location.reload();
    }
    if (e.target.matches('button#close')) {
        // Closes the browser window
        self.close();
    }
});

// setup eventlisteners on the infoBar
document.querySelector('.infoBar').addEventListener('click', function (e) {
    // did the item clicked have a muted class in it?
    if (e.target.matches('.muted')) {
        // toggle off muted class
        e.target.classList.toggle("muted");
        // toggle on unmuted class
        e.target.classList.toggle("unmuted");
        // play background music
            bgMusic.play();

    } else {
        // if it doesn't have the muted class
        // toggle off the unmuted class
        e.target.classList.toggle("unmuted");
        // toggle on the muted class
        e.target.classList.toggle("muted");
        // pause/stop the background music
        bgMusic.pause();

    }
});
