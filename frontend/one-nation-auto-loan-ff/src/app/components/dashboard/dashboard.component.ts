import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private dataService: DataService) {}
  ngOnInit(): void {}
  applicantList() {
    this.router.navigate(['applicantlist']);
  }
  editFileList() {}
  addNewFile() {}
  viewCharacteristics() {}
}
