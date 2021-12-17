const {Engine, World, Runner, Bodies, Render, Body, Events} = Matter;

const engine = Engine.create();
engine.world.gravity.y = 0
const {world} = engine;

const cellsHorizontal = 10;
const cellsVertical = 12;
// const cells = cellsHorizontal + cellsVertical; 
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const render = Render.create({
  element: document.body, 
  engine:engine,
  options:{
    wireframes: false,
    width,
    height
  }
}); //defined a canvas


Render.run(render);
Runner.run(Runner.create(), engine);

//**Walls**//
const walls = [
   Bodies.rectangle(width/2, 0, width, 2, {
    isStatic: true,
  }), 
   Bodies.rectangle(0, height/2, 2, height, {
    isStatic: true,
  }),
   Bodies.rectangle(width, height/2, 2, height, {
    isStatic: true,
  }),
   Bodies.rectangle(width/2, height, width, 2, {
    isStatic: true,
  }),
];

World.add(world, walls ) //add shape to the World Object


const shuffle =(arr) => {
  let counter = arr.length;
  n=0
   while (n < counter){
     let index = Math.floor(Math.random()*counter)
     let temp = arr[index]
     arr[index]= arr[n]
     arr[n] = temp
     n++
   }
  return arr
}
 
const grid = Array(cellsVertical).fill([]).map(() => Array(cellsHorizontal).fill(false));
const verticals = Array(cellsVertical).fill([]).map(()=>Array(cellsHorizontal-1).fill(false));
const horizontals = Array(cellsVertical-1).fill([]).map(()=>Array(cellsHorizontal).fill(false));

const firstIndex  = Math.floor(Math.random()*(cellsVertical));
const secondIndex  = Math.floor(Math.random()*(cellsHorizontal));

let startCell = grid[firstIndex][secondIndex]
// console.log (firstIndex, secondIndex) 

const stepThroughCell = (row, column) => {
  //if I have visited a cell at [row, column], then return
  if (grid[row][column]){
    return
  }
  //mark the cell as being visited
  grid[row][column]=true
  //assemble randomly assembled-ordered list of neighbors
  neighbors = shuffle([
    [row-1, column, "up"],
    [row, column+1, "right"],
    [row, column-1, "left"],
    [row+1, column, "down"],
  ]);
  // console.log(neighbors)
  //for each neighbour ....
  for (let neighbor of neighbors){
    const[nextRow, nextColumn, direction]= neighbor
    // see if the neighbour is out or bounds
    if(nextRow < 0 || 
      nextColumn < 0 || 
      nextRow >= cellsVertical || 
      nextColumn >= cellsHorizontal){
      continue;
    }
    //if we have visited that neighbour, continue to next neighbour
    if(grid[nextRow][nextColumn]){
      continue;
    } 
  //Remove a wall from either horizontals or verticals
    if(direction === "left"){
      verticals[row][column-1]=true;
    }
    else if(direction === "right"){
      verticals[row][column]=true;
    }
    else if(direction === "up"){
      horizontals[row-1][column]=true;
    }
    else if(direction === "down"){
      horizontals[row][column]=true;
    }
    
    //visit the next cell
    stepThroughCell(nextRow, nextColumn)    
  }
}

stepThroughCell(firstIndex, secondIndex)

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open){
      return
    }
    const wallX = Bodies.rectangle(
      unitLengthX*(columnIndex+ 0.5),
      unitLengthY*(rowIndex + 1), 
      unitLengthX,
       10,
       {
        isStatic: true,
        label: "wall",
        render:{
          fillStyle: "blue"
        }

      } 
    );
    World.add(world, wallX);
  })
})

verticals.forEach((row, rowIndex) =>{
  row.forEach((open, columnIndex) => {
    if (open){
      return
    }
    const wallY = Bodies.rectangle(
        unitLengthX*(columnIndex + 1), 
        unitLengthY*(rowIndex + 0.5),
        10,
        unitLengthY,
        
       {
         isStatic: true,
         label: "wall",
         render:{
          fillStyle: "blue"
        }
      });
    World.add(world, wallY);
    })
  })

// Goal
  const goal = Bodies.rectangle( 
  unitLengthX*cellsHorizontal - unitLengthX/2,   
  unitLengthY*cellsVertical - unitLengthY/2,
  unitLengthY/2,
  unitLengthY/2,
  { 
    isStatic: true,
    label: "goal",
    render:{
      fillStyle: "green"
    }
  });

World.add(world, goal);


// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY)/4
const ball = Bodies.circle(
  unitLengthX/2, 
  unitLengthY/2, 
  ballRadius,
    {
      label: "ball",
    }
  );

  World.add(world, ball)

// Key Handling
document.addEventListener("keydown", (event) => {
  const {x, y} = ball.velocity

  if(event.keyCode === 38){
    Body.setVelocity(ball, {x, y: y-3})
    console.log("Moving up")
  };
  if(event.keyCode === 39){
    Body.setVelocity(ball, {x: x+3, y})
    console.log("Moving right")
  };
  if(event.keyCode === 40){
    Body.setVelocity(ball, {x, y: y+3})
    console.log("Moving down")
  }; 
  if(event.keyCode === 37){
    Body.setVelocity(ball, {x: x-3, y })
    console.log("Moving left")
  };
});

//Win Condition
Events.on(engine, 'collisionStart', event=>{
  
  event.pairs.forEach((collision) => {
    const labels = ["goal", "ball"];
    if (labels.includes(collision.bodyA.label) &&
    labels.includes(collision.bodyB.label)){
        document.querySelector(".winner").classList.remove("hidden")
        console.log("Congratulations!");
        engine.world.gravity.y = 0.8;
        world.bodies.forEach((body) =>{
          if(body.label === "wall" ){
            Body.setStatic(body, false);
           }

        })
        }           
      }
    )
  }); 
