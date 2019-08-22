let pieceToFunc = {
  'pawn': pawnMoveCheck,
  'knight': knightMove,
  'bishop': bishopMove,
  'rook': rookMove,
  'queen': queenMove,
  'king': kingMove
}
let threatCheck = {
  'pawn': pawnThreat,
  'knight': knightMove,
  'bishop': bishopMove,
  'rook': rookMove,
  'queen': queenMove,
  'king': kingMove
}
let numberToLetter = {
  '0': 'h',
  '1': 'g',
  '2': 'f',
  '3': 'e',
  '4': 'd',
  '5': 'c',
  '6': 'b',
  '7': 'a',
}

function isMate(pieces, player){
  let possibles = []
  let ownPieces = pieces.filter(p => p.owner === player)
  ownPieces.forEach(p => {
    let pMoves = pieceToFunc[p.piece](pieces, player, p, true)
    pMoves.length > 0 ? possibles.push(...pMoves) : null
  })
  return possibles
}

function isCheck(pieces, player){
  let ks = pieces.find(p => p.piece === 'king' && p.owner === player) //where the kings are?
  let opp = pieces.filter(p => p.owner !== player) //all of the players peices
  let threats = []
  opp.forEach(o =>{ 
    let pMoves = threatCheck[o.piece](pieces, player^1, o, false)
    pMoves.length > 0 ? threats.push(...pMoves) : null
  })
  threats = threats.filter(t => t[0] === ks.x && t[1] === ks.y)
  // console.log( threats)
  return threats.length > 0 ? true : false
}

function checkCheck(pieces, piece, trgt){
  let oP = {'x': piece.x, 'y': piece.y} //place of peice
  let tI = pieces.findIndex(p => p.x === trgt.x && p.y === trgt.y)
  let oTP
  tI > -1 ? oTP = pieces.splice(tI,1) : null
  piece.x = trgt.x
  piece.y = trgt.y
  let res = isCheck(pieces, piece.owner)
  piece.x = oP.x
  piece.y = oP.y
  if (oTP){
    pieces.splice(0,0,oTP[0])
  }
  return res
}

function pawnMoveCheck(pieces, player, pawn, check){
  let moves = pawnMove(pieces, player, pawn, check)
  // console.log(moves)
  let takes = pawnThreat(pieces, player, pawn, check)
  return [...moves, ...takes]
}
function pawnThreat(pieces, player, pawn, check){
  let takes = []
  let flip = (-player || 1)
  let range = [-1,1]
  range.forEach(r => {
    if (pieces.find(p => 
      p.x === pawn.x + r && p.y === pawn.y + flip && p.owner !== player)){
      let trgt = {'x': pawn.x+r, 'y': pawn.y+flip}
      if (!check || !checkCheck(pieces, pawn, trgt)){ 
        takes.push([pawn.x + r, pawn.y + flip])
      }
    }
    // en passant (needs move history to remove captured pawn from pieces)
    if (pieces.find(p =>
      p.x == pawn.x + r && p.y === (flip ? 4 : 3) && p.piece === 'pawn' && p.owner !== player)){
      takes.push([pawn.x + r, pawn.y + flip])
    }
  })
  return takes
}
function pawnMove(pieces, player, pawn, check){
  let moves = []
  let flip = (-player || 1);
  if (! pieces.find(p => p.x === pawn.x && p.y === pawn.y + flip)){
    let trgt = {'x': pawn.x, 'y': pawn.y + flip}
    if (!check || !checkCheck(pieces, pawn, trgt)){
        moves.push([pawn.x, (pawn.y + flip)])
      }
    }
  if (pawn.y === (7+flip)%7 
  && !pieces.find(p => p.x === pawn.x && p.y === pawn.y + flip*2)){
    let trgt = {'x': pawn.x, 'y': pawn.y + flip*2}
    if (!check || !checkCheck(pieces, pawn, trgt)){
      moves.push([pawn.x, pawn.y + flip*2])
    }
  }
  return moves
}

function knightMove(pieces, player, knight, check){
  let moves = []
  let x = [1,-1, 2, -2];
  for (let i=0; i<x.length; i++){
    for (let j=0; j<x.length; j++){
      if (Math.abs(x[i]) !== Math.abs(x[j])){
        if (knight.x+x[i]<8 && knight.y+x[j]<8 && knight.x+x[i]>-1 && knight.y+x[j]>-1){
          if (!pieces.find(p => p.x === knight.x+x[i] 
                             && p.y === knight.y+x[j] 
                             && p.owner === player)){
          let trgt = {'x': knight.x+x[i], 'y': knight.y+x[j]}
            if (!check || !checkCheck(pieces, knight, trgt, false)){
              moves.push([knight.x + x[i], knight.y + x[j]])
            }
          }
        }
      }
    }
  }
  return moves
}

function bishopMove(pieces, player, bishop, check){
  let moves = []
  let dir = [-1, 1]
  dir.forEach(dX => {
    dir.forEach(dY => {
      let rangeX = (dX === 1 ? 7 - bishop.x : bishop.x)
      let rangeY = (dY === 1 ? 7 - bishop.y : bishop.y)
      let range = rangeX < rangeY ? rangeX : rangeY
      for (let r=1; r<range+1; r++){
        let sq = pieces.find(p =>  p.x === bishop.x + (r*dX)
                                && p.y === bishop.y + (r*dY))
        let trgt = {'x': bishop.x + r*dX, 'y': bishop.y + r*dY}
        if(!sq){
          if (!check || !checkCheck(pieces, bishop, trgt, false)){
            moves.push([(bishop.x + r*dX),(bishop.y + r*dY)])
          }
        }
        else if (sq.owner !== player){
          if (!check || !checkCheck(pieces, bishop, trgt, false)){
            moves.push([sq.x, sq.y])
            break
          }
        }
        else break
      }
    })
  })
  return moves
}

function rookMove(pieces, player, rook, check){
  let moves = []
  let dir = [-1,1]
  dir.forEach(dX =>{
    let rangeX = (dX === 1 ? 7 - rook.x : rook.x)
    for (let x=1; x<rangeX+1; x++){
      let trgt = pieces.find(p => p.x === rook.x + x*dX
                                 && p.y === rook.y)
      let sq = {'x': rook.x + x*dX, 'y': rook.y}
      if (!trgt){
        if (!check || !checkCheck(pieces, rook, sq, false)){
          moves.push([sq.x, sq.y])
        }
      }
      else if (trgt.owner !== player){
        if (!check || !checkCheck(pieces, rook, trgt, false)){
          moves.push([sq.x, sq.y])
          break
        }
      }
      else break
    }
  })
  dir.forEach(dY => {
    let rangeY = (dY === 1 ? 7 - rook.y : rook.y)
    for (let y=1; y<rangeY+1; y++){
      let trgt = pieces.find(p => p.y === rook.y + y*dY
                                 && p.x === rook.x)
      let sq = {'x': rook.x, 'y': rook.y + y*dY}
      if (!trgt){
        if (!check || !checkCheck(pieces, rook, sq, false)){
          moves.push([sq.x, sq.y])
        }
      }
      else if (trgt.owner !== player){
        if (!check || !checkCheck(pieces, rook, trgt, false)){
          moves.push([trgt.x, trgt.y])
          break
        }
      }
      else break
    }
  })
  return moves 
}

function queenMove(pieces, player, queen, check){
  let rMoves = rookMove(pieces, player, queen, check)
  let bMoves = bishopMove(pieces, player, queen, check)
  return [...bMoves, ...rMoves]
}

function kingMove(pieces, player, king, check){
  let moves = []
  let range = [-1,0,1]
  range.forEach(x => 
    range.forEach(y => {
      if (x|y){
        let kX = king.x + x
        let kY = king.y + y
        if (kX <= 7 && kX >= 0 && kY <= 7 && kY >= 0){
          let sq = pieces.find(p => p.x === kX && p.y === kY)
          let trgt = {'x': kX, 'y': kY}
          if (!sq){
            if (!check || !checkCheck(pieces, king, trgt, false))
            moves.push([kX, kY])
          }
          else if (sq.owner !== player){
            if (!check || !checkCheck(pieces, king, trgt, false))
            moves.push([kX, kY])
          }
        }
      }
    })
  )
  return moves
}
// modules.exports = {
//   pieceToFunc: pieceToFunc,
//   isCheck: isCheck,
//   isMate: isMate
  
// }
