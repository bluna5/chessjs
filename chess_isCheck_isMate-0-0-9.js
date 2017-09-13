process.stdin.resume()
process.stdin.setEncoding('utf8')
var util = require('util')

process.stdin.on('data', function(text){
  //console.log(  'received data', util.inspect(text))
    if (/quit\n|exit\n/i.test(text)){
      done()
    }
    if (/help\n|menu\n/i.test(text)){
      help()
    }
    if (/pieces\n/i.test(text)){
      showPieces()
    }
    if (/board\n/i.test(text)){
      showBoard()
    }
    if (/checkmate\n/i.test(text)){
      checkForMate()
    }
    else {
      console.log('not valid input: type help or menu')
    }
    
})
console.log( 'type help or menu')
function done(){
  console.log( 'process.stdin is paused. Exiting...')
  process.exit()
}
function help(){
  console.log( '\
  1) to exit, type \'quit\'or \'exit\' + ENTER\n\
  2) to view a list of pieces on the board type \'pieces\' + ENTER\n\
  3) to view the board type \'board\' + ENTER\n\
  4) to check whether the current player is in check or is check Mate type \'checkmate\' + ENTER\
  ')
}
function showPieces(){
  console.log(pieces)
}
function showBoard(){
  console.log(tBoard3x3)  
}
function checkForMate(){
  console.log(isMate(pieces, 0));
}

var tiledBoard = require('./chessBoard.js')
var tBoard3x3 = tiledBoard.buildIt3x3

var standard = require('./chessPieces.js')
var fullSet = pieces = standard.pieces
fullSet.splice(fullSet.findIndex(p=>p.piece=='testRook'),1)
/*  
var pieces=
[ { piece: 'king', owner: 1, x: 4, y: 0 },
  { piece: 'bishop', owner: 1, x: 0, y: 3, prevX: 3, prevY: 0 },
  { piece: 'queen', owner: 1, x: 0, y: 7 },
  { piece: 'pawn', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 5, y: 6 },
  { piece: 'rook', owner: 0, x: 3, y: 7 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'pawn', owner: 0, x: 1, y: 6 } ]
  */

var count=0
var buildBoard = function(){
var board0=[];
  for (var row=0; row<8; row++){
    board0[row]=[]
    for (var col=0; col<8; col++){
      if (pieces.find(p => p.x==col && p.y == row)){board0[row][col]
       = pieces.find(p => p.x==col && p.y == row)['piece'].slice(0,2)
       + (pieces.find(p=> p.x == col && p.y ==row)['owner'] ? 'B' : 'W')}
      else {board0[row][col]=[0]}}}
return board0
}


function pawnThreat(player, x, y, target){
 var flip=(-player || 1)
  if (x+1 == target.x && y+flip == target.y
  ||  x-1 == target.x && y+flip == target.y
  ||  x == target.x+1 && y == target.y && target.piece=='pawn'
      && target.prevY == target.y+2*flip
  ||  x == target.x-1 && y == target.y && target.piece=='pawn'
      && target.prevY == target.y+2*flip
){
    return true}
  else {return false}
}
function pawnMove(pieces, player, s, moves2){
var flip = (player || -1);
if (! pieces.find(p=> p.x==s.x && p.y==s.y+flip)){
var pi= pieces.findIndex(p=> p.x==s.x && p.y == s.y)
  pieces[pi]['y']=s.y+flip
  if (! isCheck(pieces, player)){
    moves2.push([s.x,s.y])
    pieces[pi]['y']=s.y-flip
  }
    else{
      pieces[pi]['y']=s.y-flip
  }
  if (s.owner==0 && s.y==6 || s.owner==1 && s.y==1){
    if (!pieces.find(p=> p.x==s.x && p.y==s.y+2*flip)){
    pieces[pi]['y']=s.y+2*flip
      if (! isCheck(pieces, player)){
        moves2.push([s.x, s.y])
        pieces[pi]['y']=s.y-2*flip
      }
      else{
        pieces[pi]['y']=s.y-2*flip
      }
    }
  }
  else{pieces[pi]['y']=s.y-flip}
}}
function knightMove(pieces, player, s, moves2){
var pi= pieces.findIndex(p=> p.x==s.x && p.y == s.y)
var x=[1,-1, 2, -2];
for (var i=0; i<x.length; i++){
  for (var j=0; j<x.length; j++){
    if (Math.abs(x[i])!==Math.abs(x[j])){
      if (s.x+x[i]<8 && s.y+x[j]<8 && s.x+x[i]>0 && s.y+x[j]>0){
        if (!pieces.find(p => p.x==s.x+x[i] && p.y==s.y+x[j])){
          pieces[pi]['x']+=x[i]
          pieces[pi]['y']+=x[j]
            if(!isCheck(pieces, player)){
              moves2.push([s.x,s.y])
              pieces[pi]['x']-=x[i]
              pieces[pi]['y']-=x[j]
            }
            else {
              pieces[pi]['x']-=x[i]
              pieces[pi]['y']-=x[j]
            }
        }
      }
    }
  }
}}
function bishopMove(pieces, player, s, moves2){
var pi= pieces.findIndex(p=> p.x==s.x && p.y == s.y)
for (var i = 1, j = 1; i<8-s.x && j<8-s.y; i++, j++){
  if (!pieces.find(p=>p.x==s.x+i && p.y==s.y+j)){
    pieces[pi]['x']+=i
    pieces[pi]['y']+=j
    if (!isCheck(pieces, player)){
      moves2.push([s.x, s.y])
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
    }
    else{
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
      break
    }
  }
  else{
    break
  }
}
for (var i = -1, j = 1; i>=-s.x && j<8-s.y; i--, j++){
  if (!pieces.find(p=>p.x==s.x+i && p.y==s.y+j)){
    pieces[pi]['x']+=i
    pieces[pi]['y']+=j
    if (!isCheck(pieces, player)){
      moves2.push([s.x, s.y])
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
    }
    else{
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
      break
    }
  }
  else{
    break
  }
}
for (var i = 1, j = -1; i<8-s.x && j>=-s.y; i++, j--){
  if (!pieces.find(p=>p.x==s.x+i && p.y==s.y+j)){
    pieces[pi]['x']+=i
    pieces[pi]['y']+=j
    if (!isCheck(pieces, player)){
      moves2.push([s.x, s.y])
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
    }
    else{
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
      break
    }
  }
  else{
    break
  }
}
for (var i = -1, j = -1; i>=-s.x && j>=-s.y; i--, j--){
  if (!pieces.find(p=>p.x==s.x+i && p.y==s.y+j)){
    pieces[pi]['x']+=i
    pieces[pi]['y']+=j
    if (!isCheck(pieces, player)){
      moves2.push([s.x, s.y])
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
    }
    else{
      pieces[pi]['x']-=i
      pieces[pi]['y']-=j
      break
    }
  }
  else{
    break
  }
}
}
function rookMove(pieces, player, s, moves2){
var pi= pieces.findIndex(p=> p.x==s.x && p.y == s.y)
  for(var i=1; i<8-s.x; i++){
    if (! pieces.find(p => p.x==s.x+i && p.y==s.y)){
      pieces[pi]['x']+=i
      if (!isCheck(pieces,player)){
        moves2.push([s.x,s.y])
        pieces[pi]['x']-=i
      }
      else{
        pieces[pi]['x']-=i
      }
    }
  }
  for(var i=1; i<8-s.y; i++){
    if (! pieces.find(p => p.x==s.x && p.y==s.y+i)){
      pieces[pi]['y']+=i
      if (!isCheck(pieces,player)){
        moves2.push([s.x,s.y])
        pieces[pi]['y']-=i
      }
      else{
        pieces[pi]['y']-=i
      }
    }
  }
  for(var i=-1; i>=-s.x; i--){
    if (! pieces.find(p => p.x==s.x+i && p.y==s.y)){
      pieces[pi]['x']+=i
      if (!isCheck(pieces,player)){
        moves2.push([s.x,s.y])
        pieces[pi]['x']-=i
      }
      else{
        pieces[pi]['x']-=i
      }
    }
  }
  for(var i=1; i>=-s.y; i--){
    if (! pieces.find(p => p.x==s.x && p.y==s.y+i)){
      pieces[pi]['y']+=i
      if (!isCheck(pieces,player)){
        moves2.push([s.x,s.y])
        pieces[pi]['y']-=i
      }
      else{
        pieces[pi]['y']-=i
      }
    }
  }
}

function canMove(pieces, player){
var set=pieces.filter(p => p.owner == player), moves2 = []
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
var opp=[], threats=[];
  for (var p in pieces){
    if (pieces[p]['owner'] != player){
      opp.push(pieces[p])
    }}
opp.forEach(function(o,i){
  if (o['piece']=='pawn' && pawnThreat(player, o.x, o.y, target)){
    threats.push(o)}

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
var ks = pieces.find(pec => pec.piece == 'king' && pec.owner == player)
  if (!ks || !pieces.length){return false}
return findThreats(pieces, player, ks)
}

function isMate(pieces, player){
var threats = isCheck(pieces, player)
  if (! threats){return false}
var ks = pieces.find(p => p.piece == 'king' && p.owner == player)
var ki = pieces.findIndex(p => p.piece == 'king' && p.owner == player);
var captures=[], kingmoves=[], blocks=[];
//captures
  for (var i = 0; i<threats.length; i++){
  var tt = findThreats(pieces, 1-player, threats[i]);
    if (tt){for (j=0; j<tt.length; j++){
    var temp = pieces.splice(pieces.findIndex(q =>
      q.x == threats[i]['x'] && q.y == threats[i]['y']),1)[0]
    var ti = pieces.findIndex(t=> t.x==tt[j]['x']
                                 && t.y==tt[j]['y'])
    var temp2 = [pieces[ti]['x'],pieces[ti]['y']]
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
var blockeds = threats.filter(t => t.piece == 'bishop'
                                || t.piece == 'rook'
                                || t.piece == 'queen')
blockeds.forEach(function(b){
var canmoves = canMove(pieces, player)
var xd=b.x-ks.x, yd=b.y-ks.y;
var xflip=(xd == 0 ? ks.x : xd>0 ? 1 : -1),
    yflip=(yd == 0 ? ks.y : yd>0? 1 : -1);
  for (var i=ks.x*xflip; i<=b.x*xflip; i++){
    for (var j=ks.y*yflip; j<=b.y*yflip; j++){
      if (Math.abs(ks.x-i*xflip) == Math.abs(ks.y-j*yflip) || xd*yd == 0){
        if (xflip*i!=ks.x || yflip*j!=ks.y){
          if (xflip*i!=b.x || yflip*j!=b.y){
            for(k=0; k<canmoves.length; k++){
               if (canmoves[k][0]==i*xflip && canmoves[k][1]==j*yflip){
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
  for (var i=-1; i<2; i++){
    for (var j=-1; j<2; j++){
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
