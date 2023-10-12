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
  backUrl: string = 'revision';
  showCheckbox = true;
  isapplicantExists = false;
  constructor(
    private apiService: ApiService,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    // public dialogRef: MatDialogRef<FileSelectionPopupComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: string
  ) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit(): void {
    // this.dataService.applicantExist$.subscribe((data) => {
    //   this.isapplicantExists = data;
    // });

    this.getListData();
    this.isapplicantExists =
      this.dataService.primaryApplicant == null ? false : true;
  }

  columnHeadings!: string[];
  action: string = 'idAction001';
  view!: string;
  dataLoaded = false;
  checkBoxLabel!: string;
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

  getListData() {
    this.apiService.getAllApplicant().subscribe({
      next: (result) => {
        this.data = result.map((res) => {
          return {
            pk: res.pk,
            sk: res.sk,
            gsI1PK: res.gsI1PK,
            gsI1SK: res.gsI1SK,
            fullName: `${res.firstName} ${res.lastName}`,
            city: res.address[0].city,
            province: res.address[0].province,
            phone: res.phone,
            creditScore: res.creditScore,
            assigned: res.tempDealerId[0].item,
            verifiedStatus: res.status,
            dealStatus: res.dealStatus,
            dateCompleted: res.completedDate,
            dateAssigned: res.assignedDate,
          };
        });
        this.tableData$.next(this.data);
        console.log(`List data ${JSON.stringify(this.data)}`);
      },
      error: console.log,
    });
  }

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
    // if (val == 'applicant') {
    //   this.dataService.isapplicantExists = true;
    // }
    this.selectedUI = val;
    this.utility = CommonConstants.listOfUI[this.selectedUI];
    this.determineTemplate();
  }
}
