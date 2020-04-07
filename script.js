function randIntBetween0and3() {
    return Math.floor(Math.random()*4);
};  //returns an integer from [0,3]


function twoOrFour() {
    let randomNumber = Math.floor(Math.random()*20);
    return randomNumber == 19 ? 4 : 2;
};  //returns either 2 or 4 with a probability of 0.95 and 0.05 resp


function areArraysEqual(arr1,arr2) {
    if(JSON.stringify(arr1) === JSON.stringify(arr2)) {
        return true;
    }
    return false;
};


let grid = {
    gridContents : [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ],  //the main grid


    prevGridContents : [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],


    setPrevGridContents() {
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                this.prevGridContents[i][j] = this.gridContents[i][j];
            }
        }
    },


    displayGrid(){
        let listOfCells = document.querySelectorAll("td");
        //console.log(listOfCells);
        let cellNumber = 0;
        let cell = listOfCells[cellNumber];
        for (const row of this.gridContents) {
            //console.log(...row)
            for (const elem of row) {
                //console.log("inspecting element: " + elem)
                //console.log("at cell number: " + cellNumber);
                if(elem!=0) {
                    cell.innerHTML = elem;
                    //console.log("elem " + elem + "written");
                }
                else {
                    cell.innerHTML = "";
                    //console.log(`cleared`);
                }
                cellNumber++;
                cell = listOfCells[cellNumber];
            }
        }

    },   //displays the grid in its current state (done testing)


    insertNewNumberAndDisplay() {
        //check if the grid is full
        let isAnyTileBlank = false;
        for (const row of this.gridContents) {
            for (const elem of row) {
                if (elem == 0) {
                    isAnyTileBlank = true;
                }
            }
        }
        if(!isAnyTileBlank) {
            //console.log("The grid is full no new number inserted")
            this.displayGrid();
            return;
        } else {
            //console.log("The grid isn't full. Inserting new number....");
            let rowNumber;
            let columnNumber;
            let number = twoOrFour();

            //find an empty cell
            while (1) {
                rowNumber = randIntBetween0and3();
                columnNumber = randIntBetween0and3();
                if (this.gridContents[rowNumber][columnNumber] == 0) {
                    this.gridContents[rowNumber][columnNumber] = number;
                    //console.log(`selected cell number: ${rowNumber} and ${columnNumber} and inserted ${number}`);
                    break;
                }
            }

            this.displayGrid();
        }
    }, //done testing


    isGameOver() {
        //check if there's a zero anywhere in the grid
        for (const row of this.gridContents) {
            for (const elem of row) {
                if(elem == 0){
                    //console.log("zero found at col " + row.indexOf(elem) + " of " + this.gridContents.indexOf(row) + "th row");
                    return false;
                }
            }
        }

        //check if left or right move is possible
        for (let i=0;i<4; i++) {
            for (let j=0; j<3; j++) {
                if(this.gridContents[i][j] == this.gridContents[i][j+1])
                {
                    console.log(`left right move is possible at ${i},${j}`);
                    return false;
                }
            }
        }
        console.log("left right move isn't possible");

        //check if up or down  move is possible
        for (let i=0;i<4;i++) {
            for (let j=0;j<3;j++)
            {
                if(this.gridContents[j][i] == this.gridContents[j+1][i]) {
                    console.log(`up/down move is possible at ${i},${j}`);
                    return false;
                }
            }
        }
        console.log("up down move isn't possible");

        return true;
    }, //done testing


    leftKeyPressed() {
        //console.log(`left key pressed. grid is: `);
        //console.log(`${this.gridContents}`);

        this.setPrevGridContents();
        //console.log("prevGridContents set equal to gridContents");
        //console.log(` ${this.prevGridContents}`);
        let wasAMoveMade = false;

        let ptrLeft;
        let ptrRight;
        for (let i=0; i<4; i++) {
            ptrLeft = 0;
            ptrRight = 1;
            //console.log(`now iterating ${i} row`);
            while ((ptrLeft < 3) && (ptrRight < 4)) {
                //console.log(`  ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
                //check if the left number is 0
                if (this.gridContents[i][ptrLeft] == 0) {
                    //console.log(`  condition 1 at ${i},${ptrLeft} and ${i},${ptrRight}`)
                    ptrLeft++;
                    ptrRight++;
                    continue;
                }

                //both numbers are same and non zero
                if (this.gridContents[i][ptrLeft] === this.gridContents[i][ptrRight]) {
                    //console.log(`  condition 2 at ${i},${ptrLeft} and ${i},${ptrRight}`)
                    this.gridContents[i][ptrLeft] += this.gridContents[i][ptrRight];
                    this.gridContents[i][ptrRight] = 0;
                    ptrLeft = ptrRight + 1;
                    ptrRight = ptrLeft + 1;
                    continue;
                }

                //if both tiles have different numbers and the right tile doesn't have 0
                if ((this.gridContents[i][ptrLeft] != this.gridContents[i][ptrRight]) && (this.gridContents[i][ptrRight] != 0)) {
                    //console.log(`  condition 3 at ${i},${ptrLeft} and ${i},${ptrRight}`);
                    ptrLeft = ptrRight;
                    ptrRight = ptrLeft + 1;
                    continue;
                }

                //if the left tile is non zero and the right tile has zer0
                if ((this.gridContents[i][ptrLeft] != this.gridContents[i][ptrRight]) && (this.gridContents[i][ptrRight] == 0)) {
                    //console.log(`  condition 4 at ${i},${ptrLeft} and ${i},${ptrRight}`)
                    ptrRight++;
                    continue;
                }

                //console.log(`no condition met ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
            }
        }

        //console.log(`grid after merge and before move: ${this.gridContents}`);

        //move
        //console.log("Now moving numbers to the left :0");

        for (let i=0; i<4; i++) {
            //console.log(`iterating row: ${i}`);
            for (let j=1; j<4; j++)
            {
                if(this.gridContents[i][j] != 0) {
                    //console.log(`moving ${i},${j}`);
                    let temp = j;
                    while ((temp >= 0) && (this.gridContents[i][temp - 1] == 0)) {
                        this.gridContents[i][temp - 1] = this.gridContents[i][temp];
                        this.gridContents[i][temp] = 0;
                        temp--;
                    }
                    //console.log(`moved to ${i},${temp}`);
                }
            }
        }


        //console.log(`grid after moving is: ${this.gridContents}`);

        //console.log(`prevGridCont is:  ${this.prevGridContents} `);

        if(!(areArraysEqual(this.gridContents, this.prevGridContents))) {
            wasAMoveMade = true;
            //console.log("Not equal.At least one move was made!");
        }

        return wasAMoveMade;
    },  //works


    rightKeyPressed() {
        //console.log(`right key pressed. grid is: `);
        //console.log(`${this.gridContents}`);

        this.setPrevGridContents();
        //console.log("prevGridContents set equal to gridContents");
        //console.log(` ${this.prevGridContents}`);
        let wasAMoveMade = false;



        let ptrLeft;
        let ptrRight;
        for (let i=0; i<4; i++) {
            ptrLeft = 3;
            ptrRight = 4;
            //console.log(`now iterating ${i} row`);
            while ((ptrLeft >= 0) && (ptrRight > 0)) {
                //console.log(`  ptrRight is ${ptrRight} ptrLeft is ${ptrLeft}`);
                //check if the right number is 0
                if (this.gridContents[i][ptrRight] == 0) {
                    //console.log(`  condition 1 at ${i},${ptrRight} and ${i},${ptrLeft}`)
                    ptrLeft--;
                    ptrRight--;
                    continue;
                }

                //both numbers are same and non zero
                if (this.gridContents[i][ptrRight] === this.gridContents[i][ptrLeft]) {
                    //console.log(`  condition 2 at ${i},${ptrRight} and ${i},${ptrLeft}`)
                    this.gridContents[i][ptrRight] += this.gridContents[i][ptrLeft];
                    this.gridContents[i][ptrLeft] = 0;
                    ptrRight = ptrLeft - 1;
                    ptrLeft = ptrRight - 1;
                    continue;
                }

                //if both tiles have different numbers and the left tile doesn't have 0
                if ((this.gridContents[i][ptrLeft] != this.gridContents[i][ptrRight]) && (this.gridContents[i][ptrLeft] != 0)) {
                    //console.log(`  condition 3 at ${i},${ptrRight} and ${i},${ptrLeft}`);
                    ptrRight = ptrLeft;
                    ptrLeft = ptrRight - 1;
                    continue;
                }

                //if the left tile is non zero and the left tile has zer0
                if ((this.gridContents[i][ptrLeft] != this.gridContents[i][ptrRight]) && (this.gridContents[i][ptrLeft] == 0)) {
                    //console.log(`  condition 4 at ${i},${ptrRight} and ${i},${ptrLeft}`)
                    ptrLeft--;
                    continue;
                }

                //console.log(`no condition met ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
            }
        }

        //console.log(`grid after merge and before move: ${this.gridContents}`);

        //move
        //console.log("Now moving numbers to the right :0");
        for (let i=0; i<4; i++) {
            //console.log(`iterating row: ${i}`);
            for (let j=2; j>=0; j--)
            {
                if(this.gridContents[i][j] != 0) {
                    //console.log(`moving ${i},${j}`);
                    let temp = j;
                    while ((temp < 3) && (this.gridContents[i][temp + 1] == 0)) {
                        this.gridContents[i][temp + 1] = this.gridContents[i][temp];
                        this.gridContents[i][temp] = 0;
                        temp++;
                    }
                    //console.log(`moved to ${i},${temp}`);
                }
            }
        }
        //console.log(`grid after moving is: ${this.gridContents}`);

        if(!areArraysEqual(this.gridContents, this.prevGridContents)) {
            wasAMoveMade = true;
            //console.log("Not equal.At least one move was made!");
        }

        return wasAMoveMade;
    },  //works


    downKeyPressed() {
        //console.log(`down key pressed. grid is: `);
        //console.log(`${this.gridContents}`);

        this.setPrevGridContents();
        //console.log("prevGridContents set equal to gridContents");
        //console.log(` ${this.prevGridContents}`);
        let wasAMoveMade = false;


        let ptrLeft;
        let ptrRight;

        for (let i=0;i<4;i++) {
            //console.log(`for column number ${i}`)
            let row = [];
            for (let j = 3; j >= 0; j--) {
                row.push(this.gridContents[j][i]);
            }
            //console.log(`row is : ${row}`);

            ptrLeft = 0;
            ptrRight = 1;
            //console.log(`now iterating ${i} row`);
            while ((ptrLeft < 3) && (ptrRight < 4)) {
                //console.log(`  ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
                //check if the left number is 0
                if (row[ptrLeft] == 0) {
                    //console.log(`  condition 1 at ${ptrLeft} and ${ptrRight}`)
                    ptrLeft++;
                    ptrRight++;
                    continue;
                }

                //both numbers are same and non zero
                if (row[ptrLeft] === row[ptrRight]) {
                    //console.log(`condition 2 met`);
                    //console.log(`  condition 2 at ${i},${ptrLeft} and ${i},${ptrRight}`)
                    row[ptrLeft] += row[ptrRight];
                    row[ptrRight] = 0;
                    ptrLeft = ptrRight + 1;
                    ptrRight = ptrLeft + 1;
                    continue;
                }

                //if both tiles have different numbers and the right tile doesn't have 0
                if ((row[ptrLeft] != row[ptrRight]) && (row[ptrRight] != 0)) {
                    //console.log(`condition 3 at ${ptrLeft} and ${ptrRight}`);
                    ptrLeft = ptrRight;
                    ptrRight = ptrLeft + 1;
                    continue;
                }

                //if the left tile is non zero and the right tile has zer0
                if ((row[ptrLeft] != row[ptrRight]) && (row[ptrRight] == 0)) {
                    //console.log(`condition 4 at ${ptrLeft} and ${ptrRight}`)
                    ptrRight++;
                    continue;
                }

                //console.log(`no condition met ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
            }



            //console.log(`grid after merge and before move: ${this.gridContents}`);

            //move
            //console.log("Now moving numbers downwards :0");


            for (let j = 1; j < 4; j++) {
                if (row[j] != 0) {
                    //console.log(`moving ${i},${j}`);
                    let temp = j;
                    while ((temp >= 0) && (row[temp - 1] == 0)) {
                        row[temp - 1] = row[temp];
                        row[temp] = 0;
                        temp--;
                    }
                    //console.log(`moved to ${i},${temp}`);
                }
            }

            for (let j=3; j>=0; j--) {
                this.gridContents[j][i] = row[3-j];
            }
        }

        //console.log(`grid after moving downwards is: ${this.gridContents}`);

        if(!areArraysEqual(this.gridContents, this.prevGridContents)) {
            wasAMoveMade = true;
            //console.log("Not equal.At least one move was made!");
        }

        return wasAMoveMade;

    }, //works


    upKeyPressed() {

        //console.log(`up key pressed. grid is: `);
        //console.log(`${this.gridContents}`);

        this.setPrevGridContents();
        //console.log("prevGridContents set equal to gridContents");
        //console.log(` ${this.prevGridContents}`);
        let wasAMoveMade = false;


        let ptrLeft;
        let ptrRight;

        for (let i=0;i<4;i++) {
            //console.log(`for column number ${i}`)
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(this.gridContents[j][i]);
            }
            //console.log(`row is : ${row}`);

            ptrLeft = 0;
            ptrRight = 1;
            //console.log(`now iterating ${i} row`);
            while ((ptrLeft < 3) && (ptrRight < 4)) {
                //console.log(`  ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
                //check if the left number is 0
                if (row[ptrLeft] == 0) {
                    //console.log(`  condition 1 at ${ptrLeft} and ${ptrRight}`)
                    ptrLeft++;
                    ptrRight++;
                    continue;
                }

                //both numbers are same and non zero
                if (row[ptrLeft] === row[ptrRight]) {
                    //console.log(`condition 2 met`);
                    //console.log(`  condition 2 at ${i},${ptrLeft} and ${i},${ptrRight}`)
                    row[ptrLeft] += row[ptrRight];
                    row[ptrRight] = 0;
                    ptrLeft = ptrRight + 1;
                    ptrRight = ptrLeft + 1;
                    continue;
                }

                //if both tiles have different numbers and the right tile doesn't have 0
                if ((row[ptrLeft] != row[ptrRight]) && (row[ptrRight] != 0)) {
                    //console.log(`condition 3 at ${ptrLeft} and ${ptrRight}`);
                    ptrLeft = ptrRight;
                    ptrRight = ptrLeft + 1;
                    continue;
                }

                //if the left tile is non zero and the right tile has zer0
                if ((row[ptrLeft] != row[ptrRight]) && (row[ptrRight] == 0)) {
                    //console.log(`condition 4 at ${ptrLeft} and ${ptrRight}`)
                    ptrRight++;
                    continue;
                }

                //console.log(`no condition met ptrLeft is ${ptrLeft} ptrRight is ${ptrRight}`);
            }



            //console.log(`grid after merge and before move: ${this.gridContents}`);

            //move
            //console.log("Now moving numbers to upwards :0");

            //console.log(`iterating row: ${i}`);
            for (let j = 1; j < 4; j++) {
                if (row[j] != 0) {
                    //console.log(`moving ${i},${j}`);
                    let temp = j;
                    while ((temp >= 0) && (row[temp - 1] == 0)) {
                        row[temp - 1] = row[temp];
                        row[temp] = 0;
                        temp--;
                    }
                    //console.log(`moved to ${i},${temp}`);
                }
            }

            for (let j=0; j<4; j++) {
                this.gridContents[j][i] = row[j];
            }
        }

        //console.log(`grid after moving upwards is: ${this.gridContents}`);


        if(!areArraysEqual(this.gridContents, this.prevGridContents)) {
            wasAMoveMade = true;
            //console.log("Not equal.At least one move was made!");
        }

        return wasAMoveMade;
    },  //works



};

document.getElementById("back").onclick = () => {
    console.log("back button clicked");
    console.log(`gridContents before copy: ${grid.gridContents}`);
    console.log(`prevGridContents before copy: ${grid.prevGridContents}`);
    for (let i=0; i<4; i++) {
        for (let j=0; j<4; j++) {
            grid.gridContents[i][j] = grid.prevGridContents[i][j];
        }
    }
    console.log(`gridContents after copy: ${grid.gridContents}`);
    console.log(`prevGridContents after copy: ${grid.prevGridContents}`);
    grid.displayGrid();
}


document.addEventListener('keydown', keyPressed);


function keyPressed(e) {
    if (e.code === "ArrowLeft") {
        //console.log("left key pressed");
        if(grid.leftKeyPressed()) {
            //console.log(` leftKeyPressed returned true.`)
            grid.insertNewNumberAndDisplay();
            if (grid.isGameOver()) {
                alert("game over! refresh the page");
            }
        }
    } else if (e.code === "ArrowUp") {
        //console.log("up key pressed");
        if(grid.upKeyPressed()) {
            //console.log(`upKeyPressed return true`);
            grid.insertNewNumberAndDisplay();
            if (grid.isGameOver()) {
                alert("game over! refresh the page");
            }
        }
    } else if (e.code === "ArrowRight") {
        //console.log("right key pressed");
        if(grid.rightKeyPressed()) {
            //console.log(`rightKeyPressed returned true`);
            grid.insertNewNumberAndDisplay();
            if (grid.isGameOver()) {
                alert("game over! refresh the page");
            }
        }
    } else if (e.code === "ArrowDown") {
        //console.log("down key pressed");
        if(grid.downKeyPressed()) {
            //console.log("downKeyPressed returned true ");
            grid.insertNewNumberAndDisplay();
            if (grid.isGameOver()) {
                alert("game over! refresh the page");
            }
        }
    }
};


grid.insertNewNumberAndDisplay();




