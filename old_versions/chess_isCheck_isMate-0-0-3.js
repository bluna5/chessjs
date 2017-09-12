// var pieces=[
//   { piece: 'rook', owner: 1, x: 0, y: 0 },
//  { piece: 'knight', owner: 1, x: 1, y: 0 },
//   { piece: 'bishop', owner: 1, x: 2, y: 0 },
//   { piece: 'queen', owner: 1, x: 3, y: 0 },
//   { piece: 'king', owner: 1, x: 4, y: 0 },
//   { piece: 'bishop', owner: 1, x: 5, y: 0 },
//   { piece: 'knight', owner: 1, x: 6, y: 0 },
//   { piece: 'rook', owner: 1, x: 7, y: 0 },
//   { piece: 'pawn', owner: 1, x: 0, y: 1 },
//   { piece: 'pawn', owner: 1, x: 1, y: 1 },
//   { piece: 'pawn', owner: 1, x: 2, y: 1 },
//   { piece: 'pawn', owner: 1, x: 3, y: 1 },
//   { piece: 'pawn', owner: 1, x: 4, y: 1 },
//   { piece: 'pawn', owner: 1, x: 5, y: 1 },
//   { piece: 'pawn', owner: 1, x: 6, y: 1 },
//   { piece: 'pawn', owner: 1, x: 7, y: 1 },
//   { piece: 'pawn', owner: 0, x: 0, y: 6 },
//   { piece: 'pawn', owner: 0, x: 1, y: 6 },
//   { piece: 'pawn', owner: 0, x: 2, y: 6 },
//   { piece: 'pawn', owner: 0, x: 3, y: 6 },
//   { piece: 'pawn', owner: 0, x: 4, y: 6 },
//   { piece: 'pawn', owner: 0, x: 5, y: 6 },
//   { piece: 'pawn', owner: 0, x: 6, y: 6 },
//   { piece: 'pawn', owner: 0, x: 7, y: 6 },
//   { piece: 'rook', owner: 0, x: 0, y: 7 },
//   { piece: 'knight', owner: 0, x: 1, y: 7 },
//   { piece: 'bishop', owner: 0, x: 2, y: 7 },
//   { piece: 'queen', owner: 0, x: 3, y: 7 },
//   { piece: 'king', owner: 0, x: 4, y: 7 },
//   { piece: 'bishop', owner: 0, x: 5, y: 7 },
//   { piece: 'knight', owner: 0, x: 6, y: 7 },
//   { piece: 'rook', owner: 0, x: 7, y: 7 }
var pieces=[
  { piece: 'king', owner: 1, x: 5, y: 1 },
  { piece: 'king', owner: 0, x: 0, y: 0 },
  { piece: 'queen', owner: 1, x: 2, y: 4 },
  { piece: 'queen', owner: 0, x: 7, y: 3 },
  { piece: 'rook', owner: 1, x:0, y: 5 },
  { piece: 'knight', owner: 0, x: 2, y: 5 },
  { piece: 'pawn', owner: 0, x: 2, y: 4 },
  { piece: 'pawn', owner: 1, x: 4, y: 1 },
  { piece: 'pawn', owner: 1, x: 7, y: 1 },
  { piece: 'bishop', owner: 1, x: 3, y: 3, prevX: 1, prevY: 2 }
];
function buildBoard(){
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

function findThreats(pieces, player, target){
var opp=[], threats=[];
  for (var p in pieces){
    if (pieces[p]['owner'] != player){
      opp.push(pieces[p])
    }}
opp.forEach(function(o,i){
  if (o['piece']=='pawn'){
    var flip=(-player || 1)
  if (o['x']+1 == target.x && o['y']+flip == target.y
  ||  o['x']-1 == target.x && o['y']+flip == target.y){
    threats.push(o)}}//end pawn

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
console.log(buildBoard());
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
  for (var i= 0; i<threats.length; i++){
  var threatthreats = findThreats(pieces, 1 - player, threats[i]);
    if (threatthreats){
      for (j=0; j<threatthreats.length; j++){
      var temp = pieces.splice(
        pieces.findIndex(q => q.x == threats[i]['x']
                           && q.y == threats[i]['y'], 1))[0]
      var ti = pieces.findIndex(t=> t.x==threatthreats[j]['x']
                                 && t.y==threatthreats[j]['y'])
      var temp2=[pieces[ti]['x'],pieces[ti]['y']]
      pieces[ti]['x']=threats[i]['x']
      pieces[ti]['y']=threats[i]['y']
        if (!isCheck(pieces, 1 - player)){
          pieces[ti]['x'] = temp2[0]
          pieces[ti]['y'] = temp2[1]
          captures.push([threatthreats[j]['x'], threatthreats[j]['y']])
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
  var xd=b.x-ks.x, yd=b.y-ks.y;
for (var i=(xd>0 ? 1 : -1); (xd>0 ? i<xd : i>xd); (xd>0? i++: i--)){
  for (var j=(yd>0 ? 1 : -1);(yd>0 ? j<yd : j>yd); (yd>0? j++ : j-- )){
    if (Math.abs(i) == Math.abs(j) || xd*yd == 0){
    var ft=findThreats(pieces, 1-player, {x:ks.x+i,y:ks.y+j})
      if (ft){ft.filter(f => f.piece!='king').forEach(function(t){
      var bi = pieces.findIndex(p => p.x == t.x && p.y == t.y)
      var temp3 = [pieces[bi]['x'],pieces[bi]['y']]
        pieces[bi]['x']=ks.x+i
        pieces[bi]['y']=ks.y+j
          if (!isCheck(pieces,player)){
            blocks.push([i,j])
            pieces[bi]['x']=temp3[0]
            pieces[bi]['y']=temp3[1]
          }
          else{
            pieces[bi]['x']=temp3[0]
            pieces[bi]['y']=temp3[1]
          }
      })}
    }
  }
}
})//end blockeds
var pawns=pieces.filter(t => t.owner == player && t.piece == 'pawn')
  if (pawns.length){
  var flip = (-player || 1)
    pawns.forEach(function(p){
      if (p){}
    })
  }



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
        else if (pieces.find(p => p.x == ks.x+i
                               && p.y == ks.y+j
                               && p.owner != player)){
          var temp = pieces.splice(
            pieces.findIndex(q => q.x == ks.x+i
                               && q.y == ks.y+j), 1)
         pieces[ki]['x']+=i
         pieces[ki]['y']+=j
          if (!isCheck(pieces, player)){
            kingmoves.push([pieces[ki]['x'], pieces[ki]['y']])
            pieces[ki]['x']-=i
            pieces[ki]['y']-=j
            pieces.push(temp)
          }
          else{
            pieces[ki]['x']-=i
            pieces[ki]['y']-=j
            pieces.push(temp)
          }
        }
      }
    }
  }//end kingmoves
  console.log(captures, blocks, kingmoves );
return captures.length + blocks.length + kingmoves.length ? false : true
};;
console.log(isMate(pieces, 1));
