import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WinnerService } from '../winner/winner.service';
import { ScreenWidthEnum } from '../shared/screen-width-enum';

@Component({
  selector: 'app-tombola',
  templateUrl: './tombola.component.html',
  styleUrls: ['./tombola.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TombolaComponent implements OnChanges {

  @ViewChild('micanvas', { static: true }) micanvas?: ElementRef<HTMLCanvasElement>;

  private _elements: any[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private _rotationActive: boolean = false;
  private rotationTime = 0;
  private totalRotationTime = Math.floor(Math.random() * (2000 - 700 + 1)) + 700;
  private slices: any[] = [];

  private xAxisCircle!: number;
  private yAxisCircle!: number;
  private radioCircle!: number;

  private rotateSpeed = 0.02; //radianes por unid de tiempo
  private rotationAngle = 0;

  constructor(private router: Router, private winnerService: WinnerService) { }

  @HostListener('window: resize', ['$event'])
  onResize() {
    this.detectScreenWidth();
  }

  ngOnInit() {
    this.detectScreenWidth();
  }

  @Input()
  set elements(value: any) {
    this._elements = value;
    //  this.drawTombola();
  }
  get elements(): any[] {
    return this._elements;
  }

  @Input()
  set rotationActive(value: boolean) {
    this._rotationActive = value;
    if (this._rotationActive)
      this.rotateCircle(); // Rotar el círculo cuando se actualizan los elementos
  }
  get rotationActive(): boolean {
    return this._rotationActive;
  }

  ngOnChanges(): void {
    if (this._elements.length > 1) {
      if (this.micanvas) {
        this.ctx = this.micanvas.nativeElement.getContext('2d');
        this.drawTombola();
      }
    } else {
      this.clearCanvas();
    }
  }

  rotateCircle() {
    if (this.ctx) {
      this.clearCanvas();
      this.drawTombola(); // Vuelve a dibujar la tómbola después de limpiar el canvas

      if (this.rotationTime >= this.totalRotationTime) {
        this.rotationActive = false; // Detiene la rotación cuando alcanza el tiempo total

        const winnerId = this.calculateCurrentSliceIndex();

        setTimeout(() => {
          this.winnerService.winnerElement = this._elements.find(e => e.id === winnerId);
          this.navigateToWinner();
        }, 1000);

      } else {

        this.rotateSpeed = this.calculateRotationSpeed();

        this.rotationAngle += this.rotateSpeed;
        requestAnimationFrame(() => this.rotateCircle());
      }

    }
  }

  clearCanvas() {
    if (this.ctx && this.micanvas) {
      this.ctx.clearRect(0, 0, this.micanvas.nativeElement.width, this.micanvas.nativeElement.height);
    }
  }

  drawTombola() {
    if (this.ctx && this.elements.length > 0) {
      const numberOfElements = this.elements.length;
      this.drawSlices(this.ctx, this.xAxisCircle, this.yAxisCircle, this.radioCircle, numberOfElements);
      this.drawTriangle(this.ctx, this.xAxisCircle);
    }
  }

  drawTriangle(cxt: any, x: number) {
    if (this.micanvas && this.elements.length > 0) {
      const size = 50; // Tamaño del triángulo
      x = x - size / 2; // Centrado en el eje x
      const y = 10; // Distancia desde la parte superior

      cxt.beginPath();
      cxt.moveTo(x, y);
      cxt.lineTo(x + size, y);
      cxt.lineTo(x + size / 2, y + size);
      cxt.fillStyle = 'grey';
      cxt.fill();
      cxt.closePath();
    }
  }

  drawSlices(cxt: any, x: number, y: number, radio: number, numberOfElements: number) {

    this.createSlices(numberOfElements);

    if (this.slices) {
      this.slices.forEach((slice: { startAngle: any; endAngle: any; color: any }) => {
        cxt.beginPath();
        cxt.moveTo(x, y);
        cxt.arc(x, y, radio, slice.startAngle + this.rotationAngle - Math.PI / 2, slice.endAngle + this.rotationAngle - Math.PI / 2);
        cxt.fillStyle = slice.color;
        cxt.fill();
        cxt.closePath();
      });
    }
  }

  createSlices(numberOfElements: number) {
    this.slices = [];
    if (numberOfElements >= 1) {
      var initialAngle = 0;
      const variationAngle = (2 * Math.PI) / numberOfElements;

      for (let i = 0; i < numberOfElements; i++) {
        this.slices.push({
          id: this._elements[i].id,
          color: this._elements[i].color,
          startAngle: initialAngle,
          endAngle: initialAngle + variationAngle,
        });

        // console.log('slice: ', this.slices[i].id ,'initialAngle: ', this.slices[i].initialAngle, 'variationAngle: ', this.slices[i].endAngle)
        initialAngle += variationAngle;
      }
    }
  }

  calculateRotationSpeed(): number {

    // Calcula el progreso actual de la rotación
    const progress = this.rotationTime / this.totalRotationTime;

    // Utiliza una función cuadrática para simular la aceleración y desaceleración
    const accelerationDeceleration = Math.sin(progress * Math.PI);

    // Ajusta el rango de la velocidad de rotación según tus necesidades
    const minSpeed = 0.02;
    const maxSpeed = 0.4;

    // Calcula la velocidad de rotación utilizando la función de aceleración y desaceleración
    const speed = minSpeed + (maxSpeed - minSpeed) * accelerationDeceleration;

    // Incrementa el tiempo de rotación
    this.rotationTime += 16; // Incrementa en el tiempo transcurrido entre frames (aprox. 16ms)

    // Devuelve la velocidad calculada
    return speed;
  }

  calculateCurrentSliceIndex(): number {

    const vueltas = Math.floor(this.rotationAngle / (2 * Math.PI));

    const resto = this.rotationAngle - vueltas * 2 * Math.PI;

    const winnerSliceAngle = (2 * Math.PI) - resto;

    var winnerSliceId: number = -1;
    this.slices.forEach(slice => {

      if (winnerSliceAngle >= slice.startAngle && winnerSliceAngle <= slice.endAngle) {

        winnerSliceId = slice.id;
      }
    });
    return winnerSliceId;
  }


  navigateToWinner() {
    const targetRoute = '/winner';
    this.router.navigateByUrl(targetRoute);
  }

  detectScreenWidth():number {

    const width = window.innerWidth;

    if (width <= ScreenWidthEnum.SmallScreen) {

      this.xAxisCircle = 300;
      this.yAxisCircle = 200;
      this.radioCircle = 150;

    } else if (width <= ScreenWidthEnum.MediumScreen) {

      this.xAxisCircle = 350;
      this.yAxisCircle = 240;
      this.radioCircle = 190;

    } else {

      this.xAxisCircle = 450;
      this.yAxisCircle = 300;
      this.radioCircle = 250;
    }

    this.clearCanvas();
    this.drawTombola();

    return width;
  }

}
