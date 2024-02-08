import { Component, ElementRef, ViewChild } from '@angular/core';
import { WinnerService } from './winner.service';
// import * as confetti from 'canvas-confetti';

import party from "party-js";
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('700ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('700ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('aumentarTamanio', [
      transition(':enter', [
        style({ fontSize: '16px' }),
        animate('1s ease-in-out', style({ fontSize: '16px' }))
      ]),
      transition(':leave', [
        animate('1s ease-in-out', style({ fontSize: '64px' }))
      ])
    ])
  ]
})
export class WinnerComponent {

  constructor(public winnerService: WinnerService, private router: Router) {
  }
  @ViewChild('spareButton') spareButton!: ElementRef<HTMLElement>;

  ngAfterViewInit() {

    setTimeout(() => {
      this.triggerFalseClick()
    }, 100)

  }

  triggerFalseClick() {
    let el: HTMLElement = this.spareButton.nativeElement;
    el.click();
  }

  showConfetti(source: any) {
    this.iniciarAnimacion()
    party.confetti(source);

  }

  estadoAnimacion = 'inicial';
  iniciarAnimacion() {
    this.estadoAnimacion = this.estadoAnimacion === 'inicial' ? 'final' : 'inicial';
  }

  navigateToHome() {
    
    this.winnerService.goneToElementsComponent = true;
    this.winnerService.updateElementsAndWinnerArrays();
    // this.winnerService.emitElements();
    // this.winnerService.emitWinners();
    const targetRoute = '/home';  
      this.router.navigateByUrl(targetRoute);
  }


}