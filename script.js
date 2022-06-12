function rdm (max){
    return Math.floor(Math.random()*(max +1));
};
function random ( min, max, floor){
    if (floor) return Math.floor((Math.random()*(max - min + 1)) + min);
    return (Math.random()*(max - min)) + min;
};
function rdmAround (x, floor){
    if (floor) return Math.floor( Math.random()* x * 2 - x )
    return Math.random()* x * 2 - x
}
function write (input){
    console.log('%c' +  JSON.stringify(input), 'color: #8BF');
    return void 0;
};
function error (input){
    console.log('%c' + JSON.stringify(input), 'color: #F54;');
    return void 0;
};
function $ (id){
    return document.getElementById(id);
};
function randomColor (){
    return `hsl( ${rdm(360)}, ${random( 20, 70, true)}%, 50%)`
}

let canvas = $('canvas')
let c = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
let maxfps = 100
let maxVelocity = 10

canvas.width = width
canvas.height = height

c.fillStyle = '#CCC'
c.strokeStyle = '#CCC'

let mouse = {
    x: width/2,
    y: height/2,
    z: false
}
window.addEventListener( 'mousemove', ( event)=>{
    mouse.x = event.x
    mouse.y = event.y
})
window.addEventListener( 'mousedown', ()=>{
    mouse.z = true
})
window.addEventListener( 'mouseup', ()=>{
    mouse.z = false
})
window.addEventListener( 'mouseleave', ()=>{
    mouse.z = false
})


class Circle {
    constructor( x, y, r, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.r = r;

        this.vx = 0;
        this.vy = 0;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 8, false);
            c.stroke();
            c.fill();
        }

        this.update = ()=>{
            this.x += this.vx
            this.y += this.vy
        }

    }
}

class Quad {
    constructor( x, y, width, height, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.vx = 0;
        this.vy = 0;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x, this.y, this.w, this.h)
        }
    }
}
class entity {
    constructor( x, y, w, h, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.vx = 0;
        this.vy = 0;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x, this.y, this.w, this.h)
        }

        this.update = ()=>{
            if( this.y + this.h < height & this.y > 0 ){
                this.y += this.vy
                while (this.y + this.h > height) {
                    this.y -= 1
                }
                while (this.y < 0) {
                    this.y += 1
                }
            }
            if( this.x + this.w < width & this.x > 0 ){
                this.x += this.vx
                while (this.x + this.w > width) {
                    this.x -= 1
                }
                while (this.x < 0) {
                    this.x += 1
                }
            }
        }
    }
}
class bullet {
    constructor( x, y, width, height, vx, vy, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.vx = vx;
        this.vy = vy;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x, this.y, this.w, this.h)
        }
        
        this.update = ()=>{
            this.x += this.vx
            this.y += this.vy
        }
    }
}
class PlayerGun {
    constructor( x, y, width, height, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.vx = 0;
        this.vy = 0;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.bulletSpeed = 8
        this.accuracy = 0.05
        this.firerate = 100 //        ms to shoot
        this.timeleft = 0

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x, this.y, this.w, this.h)
        }
        this.shoot = ()=>{
            //start a timer and only shoot when its 0 to controll the firerate
            let timer = setInterval(() => {
                this.timeleft -= 1
                if(this.timeleft <= 0){
                    this.timeleft = 0
                    clearInterval(timer)
                }
            }, 100);
            if( this.timeleft == 0 ){
             
                let vx = mouse.x - this.x
                let vy = mouse.y - this.y
                vx *= random( 1 - this.accuracy, 1 + this.accuracy)
                vy *= random( 1 - this.accuracy, 1 + this.accuracy )
                let tanAlpha = vx / vy
                let alpha = Math.atan(tanAlpha)
                let vx2 = this.bulletSpeed * Math.sin(alpha)
                let vy2 = this.bulletSpeed * Math.cos(alpha)
                
                if ( vx > 0 ) vx2 = Math.abs(vx2)
                if ( vx < 0 ) vx2 = -Math.abs(vx2)
                if ( vy > 0 ) vy2 = Math.abs(vy2)
                if ( vy < 0 ) vy2 = -Math.abs(vy2)   // dont judge me it works
             
                bullets.push( new bullet( this.x, this.y, 6, 6, vx2, vy2, 'white', 'white'))
                this.timeleft = this.firerate
            }
        }
    }
}

let frame = 0

function loop(){

//     --loop--

    setTimeout(() => {
        requestAnimationFrame(loop)
    }, 1000 / maxfps);
    c.clearRect( 0, 0, width, height)
    frame++

//   --updates--

    cursor.x = mouse.x
    cursor.y = mouse.y

    //if (player.vy < maxVelocity ) player.vy += 1
    player.update()

    playerGun.x = player.x + ( player.w - playerGun.w ) /2
    playerGun.y = player.y + ( player.h - playerGun.h ) /2
    
    bullets.forEach( element => element.update() );

    if(bullets.length > 1000) bullets.shift()
    
    if(mouse.z) playerGun.shoot()

//   --rendering--

    currentMap.forEach( element => element.render() );
    player.render()
    playerGun.render()
    bullets.forEach( element => element.render() );
    cursor.render()

}

let cursor = new Circle( width/2, height/2, 6, 'white', '#fff3')


let testMap = [
    new Quad( 450, 500, 500, 20, 'white', 'white'),
    new Quad( 900, 450, 200, 20, 'white', 'white'),
]
let currentMap = testMap
let coliders = [currentMap]

let player = new entity( 670, 300, 20, 20, 'green', randomColor())
let playerGun = new PlayerGun( 0, 0, 10, 10, 'green', 'black')
let bullets = []



loop()