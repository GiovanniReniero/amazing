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


const grid = Array(cells).fill([]).map(() => Array(cells).fill(false));
const verticals = Array(cells).fill([]).map(()=>Array(cells-1).fill(false));
const horizontals = Array(cells-1).fill([]).map(()=>Array(cells).fill(false));

const firstIndex  = Math.floor(Math.random()*(cells));
const secondIndex  = Math.floor(Math.random()*(cells));

let startCell = grid[firstIndex][secondIndex]
console.log (startCell)
console.log (firstIndex, secondIndex) 

const stepThroughCell = (cells) => {
  
}