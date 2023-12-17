import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'infus-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  standalone: true,
  imports: [TagModule],
})
export class TagComponent {}
