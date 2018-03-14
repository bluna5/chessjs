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

function isCheck(pieces, player){
  let ks = pieces.find(pec => pec.piece == 'king' && pec.owner == player)
  let opp = pieces.filter(p => p.owner !== player)
  let threats = []
  opp.forEach(o =>{ 
    let pMoves = (threatCheck[o.piece](pieces, player^1, o, false))
    pMoves.length ? threats.push(...pMoves) : null
  })
  for (t=0; t<threats.length; t++){
    if (threats[t][0] === ks.x && threats[t][1] === ks.y){
      return true
    }
  }
  return false
}

function checkCheck(pieces, piece, target){
  let oP = {'x': piece.x, 'y': piece.y}
  let tI = pieces.findIndex(p => p.x === target.x && p.y === target.y)
  let oTP
  tI > -1 ? oTP = pieces.splice(tI,1) : null
  piece.x = target.x
  piece.y = target.y
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
      let target = {'x': pawn.x+r, 'y': pawn.y+flip}
      if (check){
        if (!checkCheck(pieces, pawn, target)){ 
        takes.push([pawn.x + r, pawn.y + flip])
        }
      }
      else {
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
    let target = {'x': pawn.x, 'y': pawn.y + flip}
    if (check){
      if (!checkCheck(pieces, pawn, target)){
        moves.push([pawn.x, (pawn.y + flip)])
      }
    }
    else{
      moves.push([pawn.x, (pawn.y + flip)])
    }
    if (pawn.y === (7+flip)%7 
    && ! pieces.find(p => p.x === pawn.x && p.y === pawn.y + flip*2)){
      let target = {'x': pawn.x, 'y': pawn.y + flip*2}
      if (check){
        if (!checkCheck(pieces, pawn, target)){
          moves.push([pawn.x, pawn.y + flip*2])
        }
      }
      else {
        moves.push([pawn.x, pawn.y + flip*2])
      }
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
            let target = {'x': knight.x+x[i], 'y': knight.y+x[j]}
            if (check){
              if (!checkCheck(pieces, knight, target, false)){
                moves.push([knight.x + x[i], knight.y + x[j]])
              }
            }
            else{
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
        let target = {'x': bishop.x + r*dX, 'y': bishop.y + r*dY}
        if(!sq){
          if (check){
            if (!checkCheck(pieces, bishop, target, false)){
              moves.push([(bishop.x + r*dX),(bishop.y + r*dY)])
            }
          }
          else{
            moves.push([(bishop.x + r*dX),(bishop.y + r*dY)])
          }
        }
        else if (sq.owner !== player){
          if (check){
            if (!checkCheck(pieces, bishop, target, false)){
              moves.push([sq.x, sq.y])
              break
            }
          }
          else{
            moves.push([sq.x, sq.y])
            break
          }
        }
        else{
          break
        }
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
    let rangeY = (dX === 1 ? 7 - rook.y : rook.y)
    for (let x=1; x<rangeX+1; x++){
      let sq = pieces.find(p => p.x === rook.x + x*dX
                             && p.y === rook.y)
      let target = {'x': rook.x + x*dX, 'y': rook.y}
      if (!sq){
        if (check){
          if (!checkCheck(pieces, rook, target, false)){
            moves.push([rook.x + x*dX, rook.y])
          }
        }
        else{
          moves.push([rook.x + x*dX, rook.y])
        }
      }
      else if (sq.owner !== player){
        if (check){
          if (!checkCheck(pieces, rook, target, false)){
            moves.push([rook.x + x*dX, rook.y])
            break
          }
        }
        else {
          moves.push([rook.x + x*dX, rook.y])
          break
        }
      }
      else {
        break
      }
    }
    for (let y=1; y<rangeY+1; y++){
      let sq = pieces.find(p => p.y === rook.y + y*dX
                             && p.x === rook.x)
      let target = {'x': rook.x, 'y': rook.y + y*dX}
      if (!sq){
        if (check){
          if (!checkCheck(pieces, rook, target, false)){
            moves.push([rook.x, rook.y + y*dX])
          }
        }
        else{
          moves.push([rook.x, rook.y + y*dX])
        }
      }
      else if (sq.owner !== player){
        if(check){
          if (!checkCheck(pieces, rook, target, false)){
            moves.push([rook.x, rook.y + y*dX])
          }
        }
        else{
          moves.push([sq.x,sq.y])
          break
        }
      }
      else{
        break
      }
    }
  })
  return moves 
}

function queenMove(pieces, player, queen){
  let bMoves = bishopMove(pieces, player, queen)
  let rMoves = rookMove(pieces, player, queen)
  return [...bMoves, ...rMoves]
}

function kingMove(pieces, player, king){
  let moves = []
  let range = [-1,0,1]
  range.forEach(x => 
    range.forEach(y => {
      if (x|y){
        let kX = king.x + x
        let kY = king.y + y
        if (kX < 8 && kX > -1 && kY < 8 && kX > -1){
          let sq = pieces.find(p => p.x === kX && p.y === kY)
          if (!sq){
            moves.push([kX, kY])
          }
          else if (sq.owner !== player){
            moves.push([sq.x,sq.y])
          }
        }
      }
    })
  )
  return moves
}


/*

function isMate(pieces, player){
  let threats = isCheck(pieces, player)
    if (! threats) return false
  let ks = pieces.find(p => p.piece == 'king' && p.owner == player)
  let ki = pieces.findIndex(p => p.piece == 'king' && p.owner == player);
  let captures=[], kingmoves=[], blocks=[];
    //captures
    for (var i = 0; i<threats.length; i++){
      let tt = findThreats(pieces, 1-player, threats[i]);
      if (tt){
        for (j=0; j<tt.length; j++){
          let temp = pieces.splice(pieces.findIndex(q =>
            q.x == threats[i]['x'] && q.y == threats[i]['y']),1)[0]
          let ti = pieces.findIndex(t=> t.x==tt[j]['x']
                                       && t.y==tt[j]['y'])
          let temp2 = [pieces[ti]['x'],pieces[ti]['y']]
            pieces[ti]['x']=temp.x
            pieces[ti]['y']=temp.y
              if (!isCheck(pieces, player)){
                captures.push([tt[j]['x'], tt[j]['y']])
                pieces[ti]['x'] = temp2[0]
                pieces[ti]['y'] = temp2[1]
                pieces.push(temp)
              }
              else{
              pieces[ti]['x'] = temp2[0]
              pieces[ti]['y'] = temp2[1]
              pieces.push(temp)
              }
          }
      }
    }//end captures
  let blockeds = threats.filter(t => t.piece == 'bishop'
                                  || t.piece == 'rook'
                                  || t.piece == 'queen')
  blockeds.forEach(function(b){
    let canMoves = canMove(pieces, player)
    let xd = b.x - ks.x
    let yd = b.y - ks.y
    let xflip = (xd===0 ? ks.x : xd>0 ? 1 : -1)
    let yflip = (yd===0 ? ks.y : yd>0 ? 1 : -1)
      for (let i=ks.x*xflip; i<=b.x*xflip; i++){
        for (let j=ks.y*yflip; j<=b.y*yflip; j++){
          if (Math.abs(ks.x-i*xflip) == Math.abs(ks.y-j*yflip) || xd*yd == 0){
            if (xflip*i!=ks.x || yflip*j!=ks.y){
              if (xflip*i!=b.x || yflip*j!=b.y){
                for(k=0; k<canMoves.length; k++){
                  if (canMoves[k][0]==i*xflip && canMoves[k][1]==j*yflip){
                   blocks.push([xflip*i,yflip*j])
                  }
            }
          }
        }
      }
    }
  }
  })//end blockeds
//kingmoves
  for (let i=-1; i<2; i++){
    for (let j=-1; j<2; j++){
      if (ks.x+i<8 && ks.x+i>=0 && ks.y+j<8 && ks.y+j>=0 ){
        if (!pieces.find(p => p.x == ks.x+i && p.y == ks.y+j)){
          pieces[ki]['x']+=i
          pieces[ki]['y']+=j
          if (!isCheck(pieces, player)){
            kingmoves.push([pieces[ki]['x'],pieces[ki]['y']])
            pieces[ki]['x']-=i
            pieces[ki]['y']-=j
          }
          else{
            pieces[ki]['x']-=i
            pieces[ki]['y']-=j
          }
        }
      }
    }
  }//end kingmoves
  console.log(captures, blocks, kingmoves );
  return captures.length + blocks.length + kingmoves.length ? false : true
};;
*/
