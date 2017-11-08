let perfectSquares = [1,4,9,16,25,36,49,64,81,100,121,144,169]
let notPerfectSquares = [2,3,5,6,7,8,10, 11,12,13,14,15,17,18,19, 20,21,22,23,24,26,27,28,29, 30,31,32,33,34,35,37,38,39, 40,41,42,43,44,45,46,47,48, 50,51,52,53,54,55,56,57,58,59, 60,61,62,63,65,66,67,68,69, 70,71,72,73,74,75,76,77,78,79, 80,82,83,84,85,86,87,88,89, 90,91,92,93,94,95,96,97,98,99, 101,102,103,104,105,106,107,108,109, 110,111,112,113,114,115,116,117,118,119, 120,122,123,124,125,126,127,128,129, 130,131,132,133,134,135,136,137,138,139, 140,141,142,143,145,146,147,148,149, 150,151,152,153,154,155,156,157,158,159, 160,161,162,163,164,165,166,167,168, 170,172,173,174,175]

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickFromPerfectSquares() {
  return getRandomInt(0,1)===0 ? true : false
}

//should return (if applicable): equation type, equation string, factorable, factored solution (return each pair of () as separate object )
export function getFactorProblem(equationType='differenceOfSquares', factorable=true, difficulty=1){
  let tempEqnObj
  switch(equationType){
    case 'differenceOfSquares':
      tempEqnObj=pickDifferenceOfSquares(factorable, difficulty)
      break
  }
  return {
    equationType:equationType,
    equation:tempEqnObj.equation,
    factoredExpression:tempEqnObj.factoredExpression,
    factorable:factorable,
  }
}


function pickDifferenceOfSquares(factorable, difficulty){
  let a = 1
  let b = 0
  let c
  let factoredExpression
  if(factorable){
    c = perfectSquares[getRandomInt(0,perfectSquares.length-1)]
    let sqrtC = Math.sqrt(c)
    factoredExpression = {
      group1 : [1,sqrtC],
      group2 : [1,((-1)*sqrtC)],
      text1 : '(x+'+sqrtC+')',
      text2 : '(x-'+sqrtC+')',
    }
  }else{
    c = notPerfectSquares[getRandomInt(0,notPerfectSquares.length-1)]
    c = getRandomInt(0,1)===0 ? ((-1)*c) : c
  }
  let cString = factorable ? '-'+c : (c<0 ? ''+c : '+'+c)
  let equation = {
    a : a,
    b : b,
    c : c,
    text : 'x²' + cString,
  }
  return {
    equation: equation,
    factoredExpression: factoredExpression
  }
}
