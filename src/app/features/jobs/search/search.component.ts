import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  keywords = '';
  location = '';

  @Output() search = new EventEmitter<{ keywords: string; location: string }>();

  onSearch() {
    this.search.emit({ keywords: this.keywords, location: this.location });
  }
}
