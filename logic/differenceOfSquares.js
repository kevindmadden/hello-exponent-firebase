let perfectSquares = [1,4,9,16,25,36,49,64,81,100,121,144,169]
let notPerfectSquares = [2,3,5,6,7,8,10, 11,12,13,14,15,17,18,19, 20,21,22,23,24,26,27,28,29, 30,31,32,33,34,35,37,38,39, 40,41,42,43,44,45,46,47,48, 50,51,52,53,54,55,56,57,58,59, 60,61,62,63,65,66,67,68,69, 70,71,72,73,74,75,76,77,78,79, 80,82,83,84,85,86,87,88,89, 90,91,92,93,94,95,96,97,98,99, 101,102,103,104,105,106,107,108,109, 110,111,112,113,114,115,116,117,118,119, 120,122,123,124,125,126,127,128,129, 130,131,132,133,134,135,136,137,138,139, 140,141,142,143,145,146,147,148,149, 150,151,152,153,154,155,156,157,158,159, 160,161,162,163,164,165,166,167,168, 170,172,173,174,175]

function getRandomInt(min, max) {
    if(min > max) [min,max]=[max,min] //swap min and max if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickFromPerfectSquares() {
  return getRandomInt(0,1)===0 ? true : false
}

function isDecimalNumber(num){
  return (''+num).indexOf('.')!=-1
}

Math.gcd = function () {
  var d = Math.min.apply(Math, arguments);
  for (let n = arguments.length, i = 0; d > 1 && n > i; arguments[i] % d === 0 ? i++ : (d--, i = 0)); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
  return d;
}

//should return (if applicable): equation type, equation string, factorable, factored solution (return each pair of () as separate object )
export function getFactorProblem(equationType='differenceOfSquares', factorable=true, difficulty=1){
  let tempEqnObj
  switch(equationType){
    case 'differenceOfSquares':
      tempEqnObj=pickDifferenceOfSquares(factorable, difficulty)
      break
    case 'trinomialAis1':
      tempEqnObj=pickTrinomialWhenAis1(factorable, difficulty)
      break
    case 'trinomialAisNot1':
      tempEqnObj=pickTrinomialWhenAisNot1(factorable, difficulty)
      break
  }
  return {
    equationType:equationType,
    equation:tempEqnObj.equation,
    factoredExpression:tempEqnObj.factoredExpression,
    factorable:factorable,
  }
}

function pickTrinomialWhenAisNot1(factorable=true, difficulty=1){
  let a
  let b
  let c
  let factoredExpression

  //Default values for difficulty
  let minX1FactorSize = 1
  let maxX1FactorSize = 2
  let minX2FactorSize = 2
  let maxX2FactorSize = 3
  let maxAValue = 3
  let minFactorSize = 1
  let maxFactorSize = 10
  let maxCValue = 100
  switch(difficulty){
    case 'Easy':
      minX1FactorSize = 1
      maxX1FactorSize = 1
      minX2FactorSize = 2
      maxX2FactorSize = 3
      maxAValue = 3
      maxFactorSize = 7
      maxCValue = 15
      break
    case 'Normal':
      minX1FactorSize = 1
      maxX1FactorSize = 7
      minX2FactorSize = 2
      maxX2FactorSize = 7
      maxAValue = 25
      maxFactorSize = 12
      maxCValue = 25
      break
    case 'Hard':
      minX1FactorSize = 2
      maxX1FactorSize = 12
      minX2FactorSize = 2
      maxX2FactorSize = 12
      maxAValue = 50
      maxFactorSize = 20
      maxCValue = 60
      minFactorSize = 2
      break
    case 'Insane':
      minX1FactorSize = 2
      maxX1FactorSize = 30
      minX2FactorSize = 2
      maxX2FactorSize = 30
      maxAValue = 200
      maxFactorSize = 30
      maxCValue = 200
      minFactorSize = 2
      break
  }
  if(factorable){
    let factorX1
    let factor1
    let factorX2
    let factor2
    do{
      factorX1 = getRandomInt(minX1FactorSize, maxX1FactorSize)
      factor1 = randomlySetSign(getRandomInt(minFactorSize,maxFactorSize))
      factorX2 = getRandomInt(minX2FactorSize, Math.min(maxX2FactorSize,Math.floor(maxAValue/Math.abs(factorX1))))
      factor2 = randomlySetSign(getRandomInt(minFactorSize,Math.min(maxFactorSize,Math.floor(maxCValue/Math.abs(factor1)))))

      a=factorX1*factorX2
      b=factorX1*factor2+factorX2*factor1
      c=factor1*factor2
    }while(Math.gcd(Math.abs(a),Math.abs(b),Math.abs(c))!=1) //if a,b,c share a common factor, then generate a new problem

    factoredExpression = {
      group1 : [factorX1,factor1],
      group2 : [factorX2,factor2],
      text1 : (factorX1==1 ? '(x'+getNumTextWithSign(factor1)+')' : '('+factorX1+'x'+getNumTextWithSign(factor1)+')'), //don't write 1 in front of x
      text2 : (factorX2==1 ? '(x'+getNumTextWithSign(factor2)+')' : '('+factorX2+'x'+getNumTextWithSign(factor2)+')'),
    }
  }else{
    let isFactorable = true
    while(isFactorable){
      a=getRandomInt(minX1FactorSize*minX2FactorSize,maxAValue)
      b=randomlySetSign(getRandomInt(1,maxFactorSize+minFactorSize))
      c=randomlySetSign(getRandomInt(minFactorSize*minFactorSize,maxCValue))
      let discriminant = b*b-4*a*c
      let sqrtDiscriminantAbsVal = Math.sqrt(Math.abs(discriminant))
      if(isDecimalNumber(sqrtDiscriminantAbsVal)) isFactorable=false //if the square root of the absolute value of the discriminant is not an integer, then it is not factorable
    }
  }
  let equation = {
    a : a,
    b : b,
    c : c,
    text : b==0 ? a+'x²'+getNumTextWithSign(c) : a+'x²'+getNumTextWithSign(b)+'x'+getNumTextWithSign(c) //account for if b is 0
  }
  return {
    equation: equation,
    factoredExpression: factoredExpression
  }
}

function pickTrinomialWhenAis1(factorable=true, difficulty=1){
  let a=1
  let b
  let c
  let factoredExpression

  //Default values for difficulty
  let minFactorSize = 1
  let maxFactorSize = 10
  let maxCValue = 100
  switch(difficulty){
    case 'Easy':
      maxFactorSize = 8
      maxCValue = 24
      break
    case 'Normal':
      maxFactorSize = 12
      maxCValue = 48
      break
    case 'Hard':
      maxFactorSize = 20
      maxCValue = 60
      minFactorSize = 2
      break
    case 'Insane':
      maxFactorSize = 30
      maxCValue = 200
      minFactorSize = 2
      break
  }
  if(factorable){
    let factor1 = randomlySetSign(getRandomInt(minFactorSize,maxFactorSize))
    let factor2
    do{
      factor2 = randomlySetSign(getRandomInt(minFactorSize,Math.min(maxFactorSize,Math.floor(maxCValue/Math.abs(factor1)))))
    }while(factor2==(factor1*(-1))) //if this occured then it would be the difference of squares
    factoredExpression = {
      group1 : [1,factor1],
      group2 : [1,factor2],
      text1 : '(x'+getNumTextWithSign(factor1)+')',
      text2 : '(x'+getNumTextWithSign(factor2)+')',
    }
    b=factor1+factor2
    c=factor1*factor2
  }else{
    let isFactorable = true
    while(isFactorable){
      b=randomlySetSign(getRandomInt(1,maxFactorSize+minFactorSize))
      c=randomlySetSign(getRandomInt(minFactorSize*minFactorSize,maxCValue))
      let discriminant = b*b-4*a*c
      let sqrtDiscriminantAbsVal = Math.sqrt(Math.abs(discriminant))
      if(isDecimalNumber(sqrtDiscriminantAbsVal)) isFactorable=false //if the square root of the absolute value of the discriminant is not an integer, then it is not factorable
    }
  }
  let equation = {
    a : a,
    b : b,
    c : c,
    text : b==0 ? 'x²'+getNumTextWithSign(c) : 'x²'+getNumTextWithSign(b)+'x'+getNumTextWithSign(c) //b should never be 0 in this mode, but just in case...
  }
  return {
    equation: equation,
    factoredExpression: factoredExpression
  }
}

function pickDifferenceOfSquares(factorable, difficulty){
  let a = 1
  let b = 0
  let c
  let factoredExpression

  let highestSquaredNum = 3
  switch(difficulty){
    case 'Easy':
      highestSquaredNum=6
      break
    case 'Normal':
      highestSquaredNum=13
      break
    case 'Hard':
      highestSquaredNum=20
      break
    case 'Insane':
      highestSquaredNum=35
      break
  }

  if(factorable){
    let sqrtC = getRandomInt(1,highestSquaredNum)
    c = -1*sqrtC*sqrtC
    factoredExpression = {
      group1 : [1,(-1)*sqrtC],
      group2 : [1,sqrtC],
      text1 : '(x+'+sqrtC+')',
      text2 : '(x-'+sqrtC+')',
    }
  }else{
    do{
      c=randomlySetSign(getRandomInt(1,highestSquaredNum*highestSquaredNum+1))
    }while(!(isDecimalNumber(Math.sqrt(Math.abs(c)))))
  }
  let equation = {
    a : a,
    b : b,
    c : c,
    text : 'x²' + getNumTextWithSign(c),
  }
  return {
    equation: equation,
    factoredExpression: factoredExpression
  }
}

function randomlySetSign(num){
  return getRandomInt(0,1)===0 ? ((-1)*num) : num
}

function getNumTextWithSign(num){
  return num<0 ? ''+num : '+'+num
}
