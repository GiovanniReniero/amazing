const {Engine, World, Runner, Bodies, Render, Mouse} = Matter;

const engine = Engine.create();
const {world} = engine;

const cells = 3;
const width = 600;
const height = 600;

const render = Render.create({
  element: document.body, 
  engine:engine,
  options:{
    wireframes: true,
    width,
    height
  }
}); //defined a canvas


Render.run(render);
Runner.run(Runner.create(), engine);

//**Walls**//
const walls = [
   Bodies.rectangle(width/2, 0, width, 20, {
    isStatic: true,
  }), 
   Bodies.rectangle(0, height/2, 20, height, {
    isStatic: true,
  }),
   Bodies.rectangle(width, height/2, 20, height, {
    isStatic: true,
  }),
   Bodies.rectangle(width/2, height, width, 20, {
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
 
const grid = Array(cells).fill([]).map(() => Array(cells).fill(false));
const verticals = Array(cells).fill([]).map(()=>Array(cells-1).fill(false));
const horizontals = Array(cells-1).fill([]).map(()=>Array(cells).fill(false));

const firstIndex  = Math.floor(Math.random()*(cells));
const secondIndex  = Math.floor(Math.random()*(cells));

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
  console.log(neighbors)
  //for each neighbour ....
  for (let neighbor of neighbors){
    const[nextRow, nextColumn, direction]= neighbor
    // see if the neighbour is out or bounds
    if(nextRow < 0 || 
      nextColumn < 0 || 
      nextRow >= cells || 
      nextColumn >= cells){
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
// stepThroughCell(1, 1)

horizontals.forEach((row) => {
  row.forEach((open, idx) => {
    if (open){
      return
    }
    const wall = Bodies.rectangle();
  })
})