const {Engine, World, Runner, Bodies, Render, MouseConstraint, Mouse} = Matter;

const engine = Engine.create();
const {world} = engine;

const render = Render.create({
  element: document.body, 
  engine:engine,
  options:{
    wireframes: false,
    width:800,
    height:600
  }
}); //defined a canvas


Render.run(render);
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}));

const width = 800;
const height = 600;

//**Walls**//
const walls = [
   Bodies.rectangle(400, 0, 800, 20, {
    isStatic: true,
  }),
   Bodies.rectangle(0, 400, 20, 800, {
    isStatic: true,
  }),
   Bodies.rectangle(800, 300, 20, 600, {
    isStatic: true,
  }),
   Bodies.rectangle(400, 600, 800, 20, {
    isStatic: true,
  }),
];

World.add(world, walls ) //add shape to the World Object

//Random shapes
for(let i=0; i<32; i++){
  if (Math.random() > 0.5){
    World.add(world, 
      Bodies.rectangle( Math.random()*width, Math.random()*height, 50, 50))
  } else{
    World.add(world, 
      Bodies.circle( Math.random()*width, Math.random()*height, 40, {
      render: {
        fillStyle: "blue"
      }
      }))
  }}