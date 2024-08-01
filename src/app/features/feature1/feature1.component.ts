import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
@Component({
  selector: 'app-feature1',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent],
  templateUrl: './feature1.component.html',
  styleUrl: './feature1.component.css'
})
export class Feature1Component {

}
