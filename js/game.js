const codeToDirection = ['left', 'up', 'right', 'down'];
let timeID = [];
const gameInterface = `
<div class="upperScreen">
    <div class="ctrl">
    </div>
    <img src="resources/dog.png" width="2%">
</div>
<div class="lowerScreen">
</div>
`;

const arrowTable = `
<table>
<tr>
  <td></td>
  <td class="up"></td>
  <td></td>
</tr>
<tr>
  <td class="left"></td>
  <td class="down"></td>
  <td class="right"></td>
</tr>
</table>`
class Dogs {
    constructor(img) {
        this.img = img;
        this.left = img.offsetLeft;
        this.top = img.offsetTop;
    }
    move(screen, direction, step = 1) {
        const screenWidth = screen.offsetWidth;
        const screenHeight = screen.offsetHeight;
        const stepX = screenWidth / 200 * step;
        const stepY = screenHeight / 100 * step;
        switch (direction) {
            case "left":
                if (this.left - stepX > 0) {
                    this.left -= stepX;
                } else {
                    this.left = 0;
                };
                this.img.style.left = this.left;
                break;
            case "up":
                if (this.top - stepY > 0) {
                    this.top -= stepY;
                } else {
                    this.top = 0;
                };
                this.img.style.top = this.top;
                break;
            case "right":
                if (this.left + this.img.offsetWidth + stepX < screenWidth) {
                    this.left += stepX;
                } else {
                    this.left = screenWidth - this.img.offsetWidth;
                };
                this.img.style.left = this.left;
                break;
            case "down":
                if (this.top + this.img.offsetHeight + stepY < screenHeight) {
                    this.top += stepY;
                } else {
                    this.top = screenHeight - this.img.offsetHeight;
                };
                this.img.style.top = this.top;
                break;
        }
    }
}

overlap = (dog, screen, direction) => {
    const cell = screen.querySelector("." + direction);
    let tableLeft = 0;
    let tableTop = 0;
    if (direction !== "ctrl") {
        tableLeft = screen.querySelector("table").offsetLeft;
        tableTop = screen.querySelector("table").offsetTop;
    }
    const dogCenterX = dog.offsetLeft + dog.offsetWidth / 2, dogCenterY = dog.offsetTop + dog.offsetHeight / 2;
    return dogCenterX > cell.offsetLeft + tableLeft && dogCenterX < tableLeft + cell.offsetLeft + cell.offsetWidth && dogCenterY > cell.offsetTop + tableTop && dogCenterY < cell.offsetTop + cell.offsetHeight + tableTop;
}

const screen = document.getElementById("screen");
mousePositionDog = (dog, x, y) => {
    const dogCenterX = screen.offsetLeft+dog.offsetLeft + dog.offsetWidth / 2, dogCenterY = screen.offsetTop+dog.offsetTop + dog.offsetHeight / 2;
    if (dogCenterX - x > dogCenterY - y && dogCenterY - y > x - dogCenterX) {
        return "left";
    } else if (dogCenterX - x > dogCenterY - y && dogCenterY - y < x - dogCenterX) {
        return "down";
    } else if (dogCenterX - x < dogCenterY - y && dogCenterY - y > x - dogCenterX) {
        return "up";
    } else if (dogCenterX - x < dogCenterY - y && dogCenterY - y < x - dogCenterX) {
        return "right";
    }
}



screen.innerHTML = gameInterface;
start = document.createElement("button");
start.id = "start";
start.innerHTML = "Loading...";
document.body.appendChild(start);
yourScore = document.createElement("div");
yourScore.id = "score";
yourScore.innerHTML = "Your score: 0";
reset = document.createElement("button");
reset.id = "reset";
reset.innerHTML = "Reset";
screen.style.webkitFilter = "blur(5px)";
screen.style.filter = "blur(5px)";
let dog0 = new Dogs(document.querySelector("img"));





game = (dog, screen, score) => {
    let ctrlPressed = false;
    let newDog;
    const ctrl = screen.querySelector(".ctrl");
    const newScreen = screen.querySelector(".lowerScreen");
    timeID.push(setInterval(() => {
        ctrl.style.backgroundColor = overlap(dog.img, screen, "ctrl") ? "blue" : "transparent";
        if (ctrl.style.backgroundColor === "blue" && !ctrlPressed) {
            screen.querySelector(".upperScreen").innerHTML += arrowTable;
            dog.img = screen.querySelector("img");
            newScreen.innerHTML = gameInterface;
            ctrlPressed = true;
            yourScore.innerHTML = `Your score: ${score + 1}`;
            newDog = new Dogs(newScreen.querySelector("img"));
            game(newDog, newScreen, score + 1);
        }
        if (ctrlPressed) {
            codeToDirection.forEach(direction => {
                const arrow = screen.querySelector("." + direction);
                arrow.style.backgroundColor = overlap(dog.img, screen, direction) ? "blue" : "transparent";
                if (arrow.style.backgroundColor === "blue") {
                    newDog.move(newScreen.querySelector(".upperScreen"), direction, 0.3);
                }
            })
        }
    }
        , 16));
}

dog0.img.onload = () => {
    start.innerHTML = "Start!";
    start.onclick = (event) => {
        event.target.style.display = "none";
        screen.style.webkitFilter = "none";
        screen.style.filter = "none";
        screen.appendChild(yourScore);
        screen.appendChild(reset);
        dogKeyEvent = (event) => {
            dog0.move(document.querySelector(".upperScreen"), codeToDirection[event.which - 37]);
        }
        dogMouseEvent = (event) => {
            let mouseDown=setInterval(() => {
                dog0.move(document.querySelector(".upperScreen"), mousePositionDog(dog0.img, event.clientX, event.clientY),0.2);
                document.body.onmouseup=()=>{clearInterval(mouseDown)}               
            }, 1);          
        }
        dogTouchEvent = (event) => {
            let touch=setInterval(() => {
                dog0.move(document.querySelector(".upperScreen"), mousePositionDog(dog0.img, event.touches[0].clientX, event.touches[0].clientY),0.2);
                document.body.ontouchend=()=>{clearInterval(touch)}               
            }, 1);          
        }
        document.body.onkeydown = dogKeyEvent;
        //document.body.onmousedown = dogMouseEvent;
        document.body.ontouchstart = dogTouchEvent;
        reset.onclick = resetEvent;
        game(dog0, document, 0);
    }
}

resetEvent = () => {
    timeID.forEach(id => { clearInterval(id) });
    timeID = [];
    document.body.innerHTML = `<div id="screen"></div>`;
    document.getElementById("screen").innerHTML = gameInterface;
    yourScore.innerHTML = "Your score: 0";
    document.getElementById("screen").appendChild(yourScore);
    document.getElementById("screen").appendChild(reset);
    dog0 = new Dogs(document.querySelector("img"));
    document.body.onkeydown = dogKeyEvent;
    document.body.ontouchstart = dogTouchEvent;
    game(dog0, document, 0);
}





