import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  isOpen = false;

  toggleSidebar(open: boolean): void {
    this.isOpen = open;
  }
}
