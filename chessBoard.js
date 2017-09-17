//build a mockup chess board for 1x1 tiles
let build = function (){

  let board = []  
  for (let row=0; row<8; row++){
    let temprow=[]
    for (let col=0; col<8; col++){
      ((row.toString(2)^col.toString(2))%10)?
        temprow.push('#')
        : temprow.push(' ')
    }
    board.push(temprow)
  
  }
  return board.map(r=>r.join(''))
}
//console.log(  build())

//build a mockup with 3x3 tiles 
var standard = require('./chessPieces.js')
var pieces = standard.pieces

let build3by3 = function (){

  let board = []  
  for (let row=0; row<8; row++){
    let temprow=[]
    for (let col=0; col<8; col++){
      if (pieces.find(p => p.x==col&& p.y == row)){temprow.push(
          pieces.find(p => p.x==col && p.y == row)['piece'].slice(0,2)
       + (pieces.find(p=> p.x == col && p.y ==row)['owner'] ? 'B' : 'W'))}
      else{
      ((row.toString(2)^col.toString(2))%10)?
        temprow.push('###')
        : temprow.push('   ')
      }
    }
    for (let i=0; i<3; i++){
      board.push(temprow)
    }
  
  }
  return board.map(r=>r.join(''))

}
module.exports = {
  buildIt : build(),
  buildIt3x3 : build3by3()
}
//console.log( build3by3())
