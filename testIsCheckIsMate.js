let testSet = require('./testPiecesSet.js') 
let isCheckIsMate = require('./isCheckIsMate')
let isCheck = isCheckIsMate.isCheck
let isMate = isCheckIsMate.isMate

testSet.forEach((set, i) => {

  console.log( `run# : ${i+1}`)
  let isC = isCheck(set.pieces, set.player)
  if (isC === set['check?']){
    console.log( `isCheck ${isC} === set.check? ${set['check?']} ✅`)
  }
  else{
    console.log( `isCheck ${isC} ≠ set.check? ${set['check?']} ❌❌❌`)
  }

  let isM = isMate(set.pieces, set.player).length > 0 ? false : true
  if (isM === set['mate?'] ){
    console.log( `isMate ${isM} === set.mate? ${set['mate?']} ✅`)
  }
  else{
    console.log( `isMate ${isM} ≠ set.mate? ${set['mate?']} ❌❌❌`)
  }
})

