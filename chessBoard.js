//build a mockup chess board for 1x1 tiles
let build = function (){

  let board = []  
  for (let rows=0; rows<8; rows++){
    let temprow=[]
    for (let cols=0; cols<8; cols++){
      ((rows.toString(2)^cols.toString(2))%10)?
        temprow.push('#') : temprow.push('O')
    }
    board.push(temprow)
  
  }
  return board.map(r=>r.join(''))

}
console.log(  build())

