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
screen.innerHTML = gameInterface;
start = document.createElement("button");
start.id = "start";
start.innerHTML = "Start!";
score = document.createElement("div");
score.id = "score";
score.innerHTML = "Your score: 0";
reset = document.createElement("button");
reset.id = "reset";
reset.innerHTML = "Reset";
document.body.appendChild(start);
document.getElementById("screen").style.webkitFilter = "blur(5px)";
document.getElementById("screen").style.filter = "blur(5px)";






game = (dog, screen, score) => {
    window.onload = () => {
        let ctrlPressed = false;
        let newDog;
        const ctrl = screen.querySelector(".ctrl");
        const newScreen = screen.querySelector(".lowerScreen");
        timeID.push(setInterval(() => {
            screen.querySelector(".ctrl").style.backgroundColor = overlap(dog.img, screen, "ctrl") ? "blue" : "transparent";
            if (ctrl.style.backgroundColor === "blue" && !ctrlPressed) {
                screen.querySelector(".upperScreen").innerHTML += arrowTable;
                dog.img = screen.querySelector("img");
                newScreen.innerHTML = gameInterface;
                ctrlPressed = true;
                document.getElementById("score").innerHTML = `Your score: ${score + 1}`;
                newDog = new Dogs(newScreen.querySelector("img"));
                game(newDog, newScreen, score + 1);
            }
            if (ctrlPressed) {
                codeToDirection.forEach(direction => {
                    const arrow = screen.querySelector("." + direction);
                    arrow.style.backgroundColor = overlap(dog.img, screen, direction) ? "blue" : "transparent";
                    if (arrow.style.backgroundColor === "blue") {
                        //newDog.img=newScreen.querySelector("img");
                        newDog.move(newScreen.querySelector(".upperScreen"), direction, 0.2);
                    }
                })
            }
        }
            , 16));
    }
}
let dog0 = new Dogs(document.querySelector("img"));
window.onload = () => {
    document.getElementById("start").onclick = (event) => {
        event.target.style.display = "none";
        screen.style.webkitFilter = "none";
        screen.style.filter = "none";
        document.getElementById("screen").appendChild(score);
        document.getElementById("screen").appendChild(reset);
        dogEvent = (event) => {
            dog0.move(document.querySelector(".upperScreen"), codeToDirection[event.which - 37]);
        }
        document.body.onkeydown = dogEvent;
        document.getElementById("reset").onclick = resetEvent;
        game(dog0, document, 0);
    }
}

resetEvent = () => {
    timeID.forEach(id => { clearInterval(id) });
    timeID = [];
    document.body.innerHTML = `<div id="screen"></div>`;
    document.getElementById("screen").innerHTML = gameInterface;
    score.innerHTML = "Your score: 0";
    document.getElementById("screen").appendChild(score);
    document.getElementById("screen").appendChild(reset);
    dog0 = new Dogs(document.querySelector("img"));
    document.body.onkeydown = dogEvent;
    game(dog0, document, 0);
}





