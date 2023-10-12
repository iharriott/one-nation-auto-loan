import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-generic-grid',
  templateUrl: './generic-grid.component.html',
  styleUrls: ['./generic-grid.component.css'],
})
export class GenericGridComponent {
  @Input() tableDataState$!: BehaviorSubject<any>;
  dataSource!: MatTableDataSource<any>;
  displayColumns!: string[];
  @Input() url!: string;
  @Input() showCheckbox!: boolean;
  @Input() viewHistory: boolean = false;
  @Input() checkboxLabel: string = 'view';
  @Input() dataSourceInput!: any[];
  @Input() displayColumnsInput!: string[];
  @Output() linkClicked = new EventEmitter<any>();
  @Output() checkboxClicked = new EventEmitter<any>();
  @Output() fileHistoryLinkClicked = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.tableDataState$.subscribe((data) => {
      console.log(`data in generic`);
      this.updateTableData(data);
    });
    this.displayColumns = this.displayColumnsInput;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateTableData(data: any[]) {
    data = data || [];
    this.dataSource.data = data;
    this.paginator?.firstPage();
  }

  goback() {
    this.router.navigate([this.url]);
  }

  navigateToDetail(data: any) {
    this.linkClicked.emit(data);
  }

  onClick(state: any, data: any) {
    const obj = { state, data };
    this.checkboxClicked.emit(obj);
  }

  capitalize(value: string) {
    return value && value[0].toUpperCase() + value.slice(1);
  }
  viewFileHistory(row: any) {
    this.fileHistoryLinkClicked.emit(row);
  }
}
