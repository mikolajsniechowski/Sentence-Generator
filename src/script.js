// 1. initialize
const MUTATION_RATE = 0.01,
  SPEED = 100

document.getElementById("mutationRate").innerHTML = MUTATION_RATE*100 + "%"

var target, popMax,timer,i,mutants;
  

function startsequence()
{
    target = document.getElementById("inputtext").value;
    popMax = 150,
  timer,
  i,
document.getElementById("target").innerHTML = target;
    init(target)
    start()
}
function init(target) {
  mutants = getInitialPopulation(target);
  i = 0;
}

function start () {
  timer = setInterval(() => {
    draw()
  }, SPEED);
}

function stop() {
  clearInterval(timer)
}

function draw() {
  mutants = newGeneration(mutants)
  if (mutants.indexOf(target) !== -1) 
  {
    document.getElementById("counter").innerHTML = "<b>" +i + " generations !!!"+"</b>";
    stop();
  }
 
}

function getInitialPopulation(target) {
  return [...new Array(popMax)]
    .map( d =>
      Array(target.length) 
      .fill("a")
      .map( d => getRandomLetter() )
      .join("")
    )
}

function newGeneration(population) {
  let matePool = []

  let fitness = population.map(e => calcFitness(e, target) )
  let avgFitness = fitness.reduce((a, b) => a + b ) / fitness.length
  let best = getBest(fitness)

  let maxFitness = Math.max.apply(null, fitness);

  population
    .forEach( (e, i) =>  {
      let fit = map(fitness[i],0,maxFitness,0,0.1);
      let pool = Array(Math.floor(fit*100)).fill(e)
      matePool = [ ...matePool, ...pool]
    })
  let mutants = population.map((a) => {
    let i = Math.floor(Math.random()*matePool.length);
    let j = Math.floor(Math.random()*matePool.length);
    let child = crossover(matePool[j],matePool[j])
    let mutant = mutate(child)
    return mutant
  })
  let bestMutant = getBest(mutants.map(e => calcFitness(e, target)) )
  show(mutants, i++, avgFitness, mutants[bestMutant])
  return mutants
}

function getBest(fitness){
  return fitness.indexOf(Math.max(...fitness));
}

function calcFitness (source, target) {
  let score = 0;

  source.split("").forEach( (letter, i) => 
    target[i] === letter ? score ++ : null
  )
  return score / target.split("").length;
}
console.assert(calcFitness("love", "love") === 1)
console.assert(calcFitness("1ove", "love") === .75)

function crossover(a,b) {
  let len = target.split("").length;
  let midpoint = Math.floor(Math.random()*len) 
  let child  = a.split("").slice(0,midpoint).join("")
    + b.split("").slice(midpoint,len).join("")

  console.log(child.length)
  return child
}

function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function mutate(child) {
 return child
   .split("")
   .map( letter =>
    Math.random() < MUTATION_RATE
    ?
    getRandomLetter()
    :
    letter
   )
   .join("")
}

function getRandomLetter() {
  return " abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
}


function show(population, i, avgFitness, best) {
  var li = population.map(d => "<li>" + d + "</li>").join("")
  document.getElementById("genetic").innerHTML = "<ul style='columns: 10'>"+li+"</ul>"
  document.getElementById("counter").innerHTML = i + " generations"
  document.getElementById("avgFitness").innerHTML = Math.round(avgFitness*100)/100
  document.getElementById("best").innerHTML = best
  document.getElementById("maxPop").innerHTML = population.length
}