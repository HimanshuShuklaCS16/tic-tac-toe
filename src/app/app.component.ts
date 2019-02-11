import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Player} from './player';
import {Block} from './block';
import {GameService} from './game.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lock=false;
  constructor(public gs:GameService,private snackBar:MatSnackBar){}
  title = 'tic-tac-toe';
  newGame(){
    this.gs.freeblocksremaining=9;
    this.gs.initBlocks();
    this.lock=false;
    this.gs.turn=0;
  }
  resetGame(event){
    location.reload();
    event.preventDefault();
  }
  playerClick(i){
    if(this.gs.blocks[i].free==false||this.lock==true)//if no free block then don't do anything
    return;
    this.gs.freeblocksremaining-=1;//reduce number of free blocks after each click
    if(this.gs.freeblocksremaining<=0)
    {
      this.gs.draw+=1;
      this.lock=true;
      this.snackBar.open("game:","draw",{duration:4000});
      this.newGame();
      return;
    }
  this.gs.blocks[i].free=false;
  if(this.gs.turn==0){
    this.gs.blocks[i].setValue('tick');
  }//player1 turn
  else{
    this.gs.blocks[i].setValue('cross');
  }//bot turn
  var complete=this.gs.blockSetComplete();
  if(complete==false)
  {
    this.changeTurn();
    return
  }
  else{
    this.lock=true;
    this.gs.players[this.gs.turn].score+=1;
    this.snackBar.open("winner:","player "+(this.gs.turn +1),{
      duration:4000,
    });
    this.newGame();
    return;
  }
}
botTurn(){
  if(this.gs.freeblocksremaining<=0){
    return;
  }
  var bot_selected=this.gs.figureBotMove()-1;
  if(this.gs.blocks[bot_selected].free==true)
    this.playerClick(bot_selected);
    else{
      this.botTurn();
      return;
    }
}
changeTurn(){
  var player=this.gs.changeTurn();
  if(player==1){
    this.botTurn();
  }
}
}
