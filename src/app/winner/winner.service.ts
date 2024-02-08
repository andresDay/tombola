import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WinnerService {

  winnerElement: any;
  // winnersChanged = new Subject<any>();
  // elementsChanged = new Subject<any>();

  elements: any[] = [];
  elementsWinners: any[] = [];

  //every time it goes again, set to true once
  goneToElementsComponent = false;

  constructor() { }


  // emitElements(){
  //   console.log('llegué al emisor')
  //   this.elementsChanged.next(this.elements.slice());
  // }


  // emitWinners() {
    
  //   this.winnersChanged.next(this.elementsWinners.slice());
  // }

  updateElementsAndWinnerArrays(){
    
    console.log('elements pre splice:', this.elements)
    const arrayIndex = this.elements.indexOf(this.winnerElement);
    this.elements.splice(arrayIndex, 1);
    // this.elements = [...this.elements];
    console.log('elements post splice:', this.elements)
    this.elementsWinners.push(this.winnerElement);

  }

  resetAllElements(){
    this.elements = [];
    this.elementsWinners = [];
    this.goneToElementsComponent = false;
  }

}
