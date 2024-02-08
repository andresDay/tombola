import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementsComponent } from './elements/elements.component';
import { WinnerComponent } from './winner/winner.component';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ElementsComponent },
  { path: 'winner', component: WinnerComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
