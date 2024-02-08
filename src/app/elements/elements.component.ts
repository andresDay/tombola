import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WinnerService } from '../winner/winner.service';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent {

  elementsForm: FormGroup;
  elements: any[] = [];
  elementsWinners: any[] = [];
  rotationActive = false;

  constructor(private formBuilder: FormBuilder, public winnerService: WinnerService) {

    this.elementsForm = this.formBuilder.group({
      inputDescription: new FormControl(null, Validators.required)
    });

  }

  ngAfterViewInit(): void {

  }

  addElement() {

    const formField = this.elementsForm.get('inputDescription');
    if (formField != null) {
      const id = this.setId();
      const description = formField.value;
      this.elements = [...this.elements, { id: id, description: description, color: this.getRandomHexColor() }];

      this.winnerService.elements = this.elements;
      this.elementsForm.setValue({ 'inputDescription': '' });
    }
  }

  setId(): number {
    if (this.elements.length == 0)
      return 0;

    const ids = this.elements.map(ids => Number(ids.id));
    const maxId = Math.max(...ids);
    return maxId + 1;
  }

  removeElement(index: number) {
    this.elements.splice(index, 1);
    this.elements = [...this.elements];
    this.winnerService.elements = this.elements;
   
  }


  getRandomHexColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  onStart() {
    this.rotationActive = true;
  }

  onReset() {
    this.elements = [];
    this.elements = [...this.elements]
    this.elementsWinners = [];
    this.winnerService.resetAllElements();
  }
}