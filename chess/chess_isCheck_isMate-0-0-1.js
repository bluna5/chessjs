// var pieces=[ { piece: 'rook', owner: 1, x: 0, y: 0 }
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
//   { piece: 'rook', owner: 0, x: 7, y: 7 } ]
var pieces=[
  { piece: 'knight', owner: 1, x: 3, y: 6},
  { piece: 'king', owner: 0, x: 7, y: 7 },
  //{ piece: 'rook', owner: 1, x: 4, y: 5 } ,
  { piece: 'queen', owner: 1, x: 7, y: 6 } ,
  { piece: 'king', owner: 1, x: 5, y: 1 },
  { piece: 'queen', owner: 0, x: 0, y: 5 },
  { piece: 'pawn', owner: 0, x: 4, y: 5},
  { piece: 'bishop', owner: 1, x: 3, y: 3, prevX: 1, prevY: 2 }
];

function isCheck(pieces, player){
var board0=[];
function buildBoard(){
  for (var row=0; row<8; row++){
    board0[row]=[]
    for (var col=0; col<8; col++){
      if (pieces.find(p => p.x==col && p.y == row)){
        board0[row][col]
       = pieces.find(p => p.x==col && p.y == row)['piece'].slice(0,2)
       + (pieces.find(p=> p.x == col && p.y ==row)['owner'] ? 'B' : 'W')
      }
      else {
        board0[row][col]=[0]
      }
}
}

}buildBoard();console.log(board0);

var ks = pieces.find(pec=> pec.piece=='king' && pec.owner==player)
if (!ks || !pieces.length){return false}

var opp=[], threats=[];
    for (var p in pieces){
      if (pieces[p]['owner'] != player){
        opp.push(pieces[p])
      }}
opp.forEach(function(o,i){
  if (o['piece']=='pawn'){
    var flip=(-player || 1)
  if (o['x']+1 == ks.x && o['y']+flip == ks.y
  ||  o['x']-1 == ks.x && o['y']+flip == ks.y){
    threats.push(o)}}//end pawn

  else if (o['piece']=='knight'){
    if (o['x']+1 == ks.x && o['y']+2 == ks.y
    ||  o['x']+1 == ks.x && o['y']-2 == ks.y
    ||  o['x']-1 == ks.x && o['y']+2 == ks.y
    ||  o['x']-1 == ks.x && o['y']-2 == ks.y
    ||  o['x']+2 == ks.x && o['y']+1 == ks.y
    ||  o['x']+2 == ks.x && o['y']-1 == ks.y
    ||  o['x']-2 == ks.x && o['y']+1 == ks.y
    ||  o['x']-2 == ks.x && o['y']-1 == ks.y
  ){threats.push(o)}}//end knight

  else if (o['piece'] == 'bishop'){
    for (var i = 1, j = 1; i<8-ks.x, j<8-ks.y; i++, j++){
      if (o['x'] == ks.x + i && o['y'] == ks.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x + i
      && p['y'] == ks.y + j) !== undefined){break;}}
    for (var i = 1, j = -1; i<8-ks.x, j>=-ks.y; i++, j--){
      if (o['x'] == ks.x + i && o['y'] == ks.y  + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x + i
      && p['y'] == ks.y + j) != undefined){break;}}
    for (var i = -1, j = 1; i>=-ks.x, j<8-ks.y; i--, j++){
      if (o['x'] == ks.x + i && o['y'] == ks.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x + i
      && p['y'] == ks.y + j) !== undefined){break;}}
    for (var i = -1, j=-1; i>=-ks.x, j>=-ks.y; i--, j--){
      if (o['x'] == ks.x + i && o['y'] == ks.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x']==ks.x + i
      && p['y'] == ks.y + j) !== undefined){break;}}
  }//end bishop

  else if (o['piece']=='rook'){
    for (var j=1; j<8-ks.y; j++){
      if (o['x'] == ks.x && o['y'] == ks.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x
      && p['y'] == ks.y + j) !== undefined){break;}}
    for (var j=-1; j>=-ks.y; j--){
      if (o['x'] == ks.x && o['y'] == ks.y + j){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x
      && p['y'] == ks.y + j)!== undefined){break;}}
    for (var j=1; j<8-ks.x; j++){
      if (o['x'] == ks.x + j && o['y'] == ks.y){
        threats.push(o);break;}
        else if (pieces.find(p => p['x'] == ks.x + j
        && p['y'] == ks.y) !== undefined){break;}}
    for (var j=-1; j>=-ks.x; j--){
      if (o['x'] == ks.x + j && o['y'] == ks.y){
        threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x + j
      && p['y'] == ks.y) !== undefined){break;}}
  }//end rook

else if (o['piece']=='queen'){
  for (var i = 1, j = 1; i<8-ks.x, j<8-ks.y; i++, j++){
    if (o['x'] == ks.x + i && o['y'] == ks.y + j){
      threats.push(o);break;}
    else if (pieces.find(p => p['x'] == ks.x + i
    && p['y'] == ks.y + j) !== undefined){break;}}
  for (var i = 1, j = -1; i<8-ks.x, j>=-ks.y; i++, j--){
    if (o['x'] == ks.x + i && o['y'] == ks.y  + j){
      threats.push(o);break;}
    else if (pieces.find(p => p['x'] == ks.x + i
    && p['y'] == ks.y + j) != undefined){break;}}
  for (var i = -1, j = 1; i>=-ks.x, j<8-ks.y; i--, j++){
    if (o['x'] == ks.x + i && o['y'] == ks.y + j){
      threats.push(o);break;}
    else if (pieces.find(p => p['x'] == ks.x + i
    && p['y'] == ks.y + j) !== undefined){break;}}
  for (var i = -1, j=-1; i>=-ks.x, j>=-ks.y; i--, j--){
    if (o['x'] == ks.x + i && o['y'] == ks.y + j){
      threats.push(o);break;}
    else if (pieces.find(p => p['x']==ks.x + i
    && p['y'] == ks.y + j) !== undefined){break;}}
  for (var j=1; j<8-ks.y; j++){
    if (o['x'] == ks.x && o['y'] == ks.y + j){
      threats.push(o);break;}
    else if (pieces.find(p => p['x'] == ks.x
    && p['y'] == ks.y + j) !== undefined){break;}}
  for (var j=-1; j>=-ks.y; j--){
    if (o['x'] == ks.x && o['y'] == ks.y + j){
      threats.push(o);break;}
    else if (pieces.find(p => p['x'] == ks.x
    && p['y'] == ks.y + j)!== undefined){break;}}
  for (var j=1; j<8-ks.x; j++){
    if (o['x'] == ks.x + j && o['y'] == ks.y){
      threats.push(o);break;}
      else if (pieces.find(p => p['x'] == ks.x + j
      && p['y'] == ks.y) !== undefined){break;}}
  for (var j=-1; j>=-ks.x; j--){
    if (o['x'] == ks.x + j && o['y'] == ks.y){
      threats.push(o);break;}
    else if (pieces.find(p => p['x'] == ks.x + j
    && p['y'] == ks.y) !== undefined){break;}}
  }//end queen

  if (o['piece']=='king'){
    if (o['x']+1 == ks.x && o['y']+1 == ks.y){threats.push(o)}
    if (o['x']-1 == ks.x && o['y']+1 == ks.y){threats.push(o)}
    if (o['x']+1 == ks.x && o['y']-1 == ks.y){threats.push(o)}
    if (o['x']-1 == ks.x && o['y']-1 == ks.y){threats.push(o)}
    if (o['x']+1 == ks.x && o['y'] == ks.y){threats.push(o)}
    if (o['x']-1 == ks.x && o['y'] == ks.y){threats.push(o)}
    if (o['x'] == ks.x && o['y']+1 == ks.y){threats.push(o)}
    if (o['x'] == ks.x && o['y']-1 == ks.y){threats.push(o)}
  }//end king

})//end opp.forEach

return threats.length? threats : false

};;console.log(isCheck(pieces, 0));

//////////

function isMate(pieces, player){
  if (! isCheck(pieces,player)){return false}
var ks = pieces.find(pec => pec.piece == 'king'
                         && pec.owner == player)
var ki = pieces.findIndex(p => p.piece == 'king' && p.owner == player);
var kingmoves=[]
  for (var i=-1; i<2; i++){
    for (var j=-1; j<2; j++){
      if (ks.x+i<8 && ks.x+i>=0 && ks.y+j<8 && ks.y+j>=0 ){
        if (!pieces.find(p => p.x == ks.x+i && p.y == ks.y+j)){
          pieces[ki]['x']+=i ;
          pieces[ki]['y']+=j ;
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
         pieces[ki]['x']+=i;
         pieces[ki]['y']+=j;
          if (!isCheck(pieces, player)){
            kingmoves.push([pieces[ki]['x'], pieces[ki]['y']])
            console.log(kingmoves);
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
  }

  console.log(kingmoves.length);
  return kingmoves.length ? false : true
};;
console.log(isMate(pieces, 0));
