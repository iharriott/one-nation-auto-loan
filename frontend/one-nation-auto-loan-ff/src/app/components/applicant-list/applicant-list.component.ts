import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  Input,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { BehaviorSubject } from 'rxjs';

import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonConstants } from 'src/app/constants/common-constants';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.css'],
})
export class ApplicantListComponent implements OnInit {
  @Input() branch!: any;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  tableData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  backUrl: string = 'dashboard';
  showCheckbox = false;
  isapplicantExists = false;
  isEditMode = false;
  constructor(
    private apiService: ApiService,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: string
  ) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit(): void {
    //debugger;
    // this.dataService.applicantExist$.subscribe((data) => {
    //   this.isapplicantExists = data;
    // });

    this.dataService.getNewListData();
    this.dataService.applicantExist$.subscribe({
      next: (data) => {
        this.isapplicantExists = data;
      },
      error: console.log,
    });
    //this.dataService.primaryApplicant == null ? false : true;
    this.dataService.editMode$.subscribe({
      next: (data) => {
        this.isEditMode = data;
      },
    });
  }

  columnHeadings!: string[];
  action: string = 'idAction001';
  view!: string;
  dataLoaded = false;
  checkBoxLabel: string = 'Hide';
  buttonLabel!: string;
  navigatedRoute!: string;
  fontIcon!: string;
  dialogText!: string;
  viewFileHistory!: false;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;
  @ViewChild('employment', { static: true })
  public employment!: TemplateRef<any>;
  @ViewChild('mortgage', { static: true })
  public mortgage!: TemplateRef<any>;
  @ViewChild('note', { static: true })
  public note!: TemplateRef<any>;
  @ViewChild('applicant', { static: true })
  public applicant!: TemplateRef<any>;
  utility: any;
  selectedUI!: string;
  applicantExist!: boolean;
  data: any;

  displayedColumns = [
    // 'pk',
    // 'sk',
    // 'gsI1PK',
    // 'gsI1SK',
    'fullName',
    'city',
    'province',
    'phone',
    'creditScore',
    'assigned',
    'verifiedStatus',
    'dealStatus',
    'dateCompleted',
    'dateAssigned',
    'action',
  ];

  loadData(row: any) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.determineTemplate();
  }

  deleteRow(row: any) {
    // debugger;
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      if (data == 'delete') {
        const { pk, sk } = row;
        this.dataService.applicantPk = pk;
        this.dataService.applicantSk = sk;
        this.apiService.deleteApplicant(sk, pk).subscribe({
          next: (data) => {
            this.dataService.openSackBar('Applicant Deleted', 'OK');
            this.dataService.getNewListData();
          },
          error: console.log,
        });
      }
    });
  }

  editRow(row: any) {
    const { pk, sk } = row;
    this.dataService.applicantPk = pk;
    this.dataService.applicantSk = sk;
    this.setTemplate('applicant');
    this.dataService.primaryApplicant = row;
    this.dataService.editMode$.next(true);
  }

  onChange(row: any) {}
  viewHistory(event: any) {}

  determineTemplate() {
    this.container.clear();
    switch (this.utility) {
      case 'employment': {
        this.container.createEmbeddedView(this.employment);
        break;
      }
      case 'mortgage': {
        this.container.createEmbeddedView(this.mortgage);
        break;
      }
      case 'note': {
        this.container.createEmbeddedView(this.note);
        break;
      }
      case 'applicant': {
        this.container.createEmbeddedView(this.applicant);
        break;
      }
      default: {
        // this.container.createEmbeddedView(this.employment);
        break;
      }
    }
  }

  setTemplate(val: string) {
    debugger;
    //this.dataService.editMode$.next(true);
    //this.dataService.applicantExist$.next(false);
    this.selectedUI = val;
    this.utility = CommonConstants.listOfUI[this.selectedUI];
    this.determineTemplate();
  }

  hideApplicant(data: any) {
    debugger;
    const user = this.dataService.getLoggedInUser();
    const { pk, sk } = data;
    const currentApplicant = { pk, sk };
    this.dataService.updateAttribute(currentApplicant, user, 'HIDE');
    this.dataService.getNewListData();
    this.dialogData = 'Applicant Successfully Hidden';
    this.dataService.openSackBar(this.dialogData, 'ok');
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): any {
    return this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
