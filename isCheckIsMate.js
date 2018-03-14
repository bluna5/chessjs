let pieceToFunc = {
  'pawn': pawnMoveCheck,
  'knight': knightMove,
  'bishop': bishopMove,
  'rook': rookMove
}

function pawnMoveCheck(pieces, player, pawn){
  let moves = pawnMove(pieces, player, pawn)
  let takes = pawnThreat(pieces, player, pawn)
  return [...moves, ...takes]
}
function pawnThreat(pieces, player, pawn){
  let takes = []
  let flip = (-player || 1)
  let range = [-1,1]
  range.forEach(r => {
    if (pieces.find(p => 
      p.x === pawn.x + r && p.y === pawn.y + flip && p.owner !== player)){
      takes.push([pawn.x + r, pawn.y + flip]) 
    }
    if (pieces.find(p =>
      p.x == pawn.x + r && p.y === (flip ? 4 : 5) && p.piece === 'pawn' && p.owner !== player)){
      takes.push([pawn.x + r, pawn.y + flip])
    }
  })
  return takes
}
function pawnMove(pieces, player, pawn){
  let moves = []
  let flip = (-player || 1);
  if (! pieces.find(p => p.x === pawn.x && p.y === pawn.y + flip)){
    moves.push([pawn.x, (pawn.y + flip)])
    if (pawn.y === (7+flip)%7 
    && ! pieces.find(p => p.x === pawn.x && p.y === pawn.y + flip*2)){
      moves.push([pawn.x, (pawn.y + flip*2)])
    }
  }
  return moves
}

function knightMove(pieces, player, knight){
  let moves = []
  let x = [1,-1, 2, -2];
  for (let i=0; i<x.length; i++){
    for (let j=0; j<x.length; j++){
      if (Math.abs(x[i]) !== Math.abs(x[j])){
        if (knight.x+x[i]<8 && knight.y+x[j]<8 && knight.x+x[i]>-1 && knight.y+x[j]>-1){
          if (!pieces.find(p => p.x === knight.x+x[i] 
                             && p.y === knight.y+x[j] 
                             && p.owner === player)){
            moves.push([knight.x + x[i], knight.y + x[j]])
          }
        }
      }
    }
  }
  return moves
}

function bishopMove(pieces, player, bishop){
  console.log( 'binchop')
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
        if(!sq){
          moves.push([(bishop.x + r*dX), (bishop.y + r*dY)])
        }
        else if (sq.owner !== player){
          moves.push([bishop.x + r*dX, bishop.y + r*dY])
          break
        }
        else{
          break
        }
      }
    })
  })
return moves
}

function rookMove(pieces, player, rook){
  
}

/*
function canMove(pieces, player){
  let set = pieces.filter(p => p.owner === player)
  let moves2 = []
  set.forEach(function(s){
    if (s.piece == 'pawn'){
      pawnMove(pieces, player, s, moves2)
    }
    if (s.piece =='knight'){
      knightMove(pieces, player, s, moves2)
    }
    if (s.piece == 'bishop'){
      bishopMove(pieces, player, s, moves2)
    }
    if (s.piece == 'rook'){
      rookMove(pieces, player, s, moves2)
    }
    if (s.piece == 'queen'){
      bishopMove(pieces, player, s, moves2)
      rookMove(pieces, player, s, moves2)
    }
  })
  return moves2
}

function findThreats(pieces, player, target){
  let opp = [], threats = []
  for (let p in pieces){
    if (pieces[p]['owner'] !== player){
      opp.push(pieces[p])
    }
  }
  opp.forEach(function(o,i){
    if (o['piece'] === 'pawn' && pawnThreat(player, o.x, o.y, target)){
      threats.push(o)
    }

    else if (o['piece']=='knight'){
      if (o['x']+1 == target.x && o['y']+2 == target.y
      ||  o['x']+1 == target.x && o['y']-2 == target.y
      ||  o['x']-1 == target.x && o['y']+2 == target.y
      ||  o['x']-1 == target.x && o['y']-2 == target.y
      ||  o['x']+2 == target.x && o['y']+1 == target.y
      ||  o['x']+2 == target.x && o['y']-1 == target.y
      ||  o['x']-2 == target.x && o['y']+1 == target.y
      ||  o['x']-2 == target.x && o['y']-1 == target.y
    ){threats.push(o)}}//end knight

    else if (o['piece'] == 'bishop'){
      for (var i = 1, j = 1; i<8-target.x && j<8-target.y; i++, j++){
        if (o['x'] == target.x + i && o['y'] == target.y + j){
          threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x + i
        && p['y'] == target.y + j) !== undefined){break;}}
      for (var i = 1, j = -1; i<8-target.x && j>=-target.y; i++, j--){
        if (o['x'] == target.x + i && o['y'] == target.y  + j){
          threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x + i
        && p['y'] == target.y + j) != undefined){break;}}
      for (var i = -1, j = 1; i>=-target.x && j<8-target.y; i--, j++){
        if (o['x'] == target.x + i && o['y'] == target.y + j){
          threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x + i
        && p['y'] == target.y + j) !== undefined){break;}}
      for (var i = -1, j=-1; i>=-target.x && j>=-target.y; i--, j--){
        if (o['x'] == target.x + i && o['y'] == target.y + j){
          threats.push(o);break;}
        else if (pieces.find(p => p['x']==target.x + i
        && p['y'] == target.y + j) !== undefined){break;}}
    }//end bishop

    else if (o['piece']=='rook'){
      for (var j=1; j<8-target.y; j++){
        if (o['x'] == target.x && o['y'] == target.y + j){
          threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x
        && p['y'] == target.y + j) !== undefined){break;}}
      for (var j=-1; j>=-target.y; j--){
        if (o['x'] == target.x && o['y'] == target.y + j){
          threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x
        && p['y'] == target.y + j)!== undefined){break;}}
      for (var j=1; j<8-target.x; j++){
        if (o['x'] == target.x + j && o['y'] == target.y){
          threats.push(o);break;}
          else if (pieces.find(p => p['x'] == target.x + j
          && p['y'] == target.y) !== undefined){break;}}
      for (var j=-1; j>=-target.x; j--){
        if (o['x'] == target.x + j && o['y'] == target.y){
          threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x + j
        && p['y'] == target.y) !== undefined){break;}}
    }//end rook

  else if (o['piece']=='queen'){
    for (var i = 1, j = 1; i<8-target.x, j<8-target.y; i++, j++){
      if (o['x'] == target.x + i && o['y'] == target.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == target.x + i
      && p['y'] == target.y + j) !== undefined){break;}}
    for (var i = 1, j = -1; i<8-target.x, j>=-target.y; i++, j--){
      if (o['x'] == target.x + i && o['y'] == target.y  + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == target.x + i
      && p['y'] == target.y + j) != undefined){break;}}
    for (var i = -1, j = 1; i>=-target.x, j<8-target.y; i--, j++){
      if (o['x'] == target.x + i && o['y'] == target.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == target.x + i
      && p['y'] == target.y + j) !== undefined){break;}}
    for (var i = -1, j=-1; i>=-target.x, j>=-target.y; i--, j--){
      if (o['x'] == target.x + i && o['y'] == target.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x']==target.x + i
      && p['y'] == target.y + j) !== undefined){break;}}
    for (var j=1; j<8-target.y; j++){
      if (o['x'] == target.x && o['y'] == target.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == target.x
      && p['y'] == target.y + j) !== undefined){break;}}
    for (var j=-1; j>=-target.y; j--){
      if (o['x'] == target.x && o['y'] == target.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == target.x
      && p['y'] == target.y + j)!== undefined){break;}}
    for (var j=1; j<8-target.x; j++){
      if (o['x'] == target.x + j && o['y'] == target.y){
        threats.push(o);break;}
        else if (pieces.find(p => p['x'] == target.x + j
        && p['y'] == target.y) !== undefined){break;}}
    for (var j=-1; j>=-target.x; j--){
      if (o['x'] == target.x + j && o['y'] == target.y){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == target.x + j
      && p['y'] == target.y) !== undefined){break;}}
    }//end queen

    if (o['piece']=='king'){
      if (o['x']+1 == target.x && o['y']+1 == target.y){threats.push(o)}
      if (o['x']-1 == target.x && o['y']+1 == target.y){threats.push(o)}
      if (o['x']+1 == target.x && o['y']-1 == target.y){threats.push(o)}
      if (o['x']-1 == target.x && o['y']-1 == target.y){threats.push(o)}
      if (o['x']+1 == target.x && o['y'] == target.y){threats.push(o)}
      if (o['x']-1 == target.x && o['y'] == target.y){threats.push(o)}
      if (o['x'] == target.x && o['y']+1 == target.y){threats.push(o)}
      if (o['x'] == target.x && o['y']-1 == target.y){threats.push(o)}
    }//end king
})//end opp.forEach

  return threats.length ? threats : false
}//end findThreats

function isCheck(pieces, player){
  let ks = pieces.find(pec => pec.piece == 'king' && pec.owner == player)
  if (!ks || !pieces.length) return false
  return findThreats(pieces, player, ks)
}

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
