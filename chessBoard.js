//build a mockup chess board for 1x1 tiles
let build = function (){

  let board = []  
  for (let rows=0; rows<8; rows++){
    let temprow=[]
    for (let cols=0; cols<8; cols++){
      ((rows.toString(2)^cols.toString(2))%10)?
        temprow.push('#')
        : temprow.push(' ')
    }
    board.push(temprow)
  
  }
  return board.map(r=>r.join(''))
}
console.log(  build())

//build a mockup with 3x3 tiles 
let build3by3 = function (){

  let board = []  
  for (let rows=0; rows<8; rows++){
    let temprow=[]
    for (let cols=0; cols<8; cols++){
      ((rows.toString(2)^cols.toString(2))%10)?
        temprow.push('###')
        : temprow.push('   ')
    }
    for (let i=0; i<3; i++){
      board.push(temprow)
    }
  
  }
  return board.map(r=>r.join(''))

}
console.log( build3by3())
