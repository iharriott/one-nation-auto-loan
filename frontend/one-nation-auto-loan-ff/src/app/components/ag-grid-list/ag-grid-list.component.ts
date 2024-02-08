import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  signal,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  ICellRendererParams,
  RowClassParams,
  RowStyle,
  GridOptions,
} from 'ag-grid-community';
import { Applicant } from 'src/app/interfaces/applicant';
import { DataService } from 'src/app/services/data.service';
import { GridDeleteComponent } from '../grid-delete/grid-delete.component';
import { CommonConstants } from 'src/app/constants/common-constants';
import * as R from 'ramda';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SearchParams } from 'src/app/interfaces/searchParams';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-ag-grid-list',
  templateUrl: './ag-grid-list.component.html',
  styleUrls: ['./ag-grid-list.component.css'],
})
export class AgGridListComponent implements OnInit {
  searchForm!: FormGroup;
  status = CommonConstants.status;
  dealStatus = CommonConstants.dealStatus;
  dealers = CommonConstants.dealer;
  applicantStatus = CommonConstants.applicantStatus;

  constructor(
    public dataService: DataService,
    public apiService: ApiService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.context = {
      componentParent: this,
    };

    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      status: [],
      dealStatus: [],
      referralCode: [],
      tempDealerId: [],
      display: [],
      completionStartDate: [],
      completionEndDate: [],
      createdStartDate: [],
      createdEndDate: [],
    });
  }

  private gridApi!: GridApi<Applicant>;
  private gridColumnApi: any;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  public pinnedTopRowData: any[] = [];
  public pinnedBottomRowData: any[] = [];
  dropdownList: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  context: any;
  params: any;
  showMoreText: string = 'More';

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
  @ViewChild('applicantview', { static: true })
  public applicantview!: TemplateRef<any>;
  @ViewChild('vehicle', { static: true })
  public vehicle!: TemplateRef<any>;
  utility: any;
  selectedUI!: string;
  applicantExist!: boolean;
  data: any;
  backUrl: string = 'dashboard';
  showCheckbox = true;
  isapplicantExists = false;
  isEditMode = false;
  dialogData!: string;
  checkboxLabel = 'Show Hidden';
  getRowHeight: any;
  searchValue = 'searcg';
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  showLessCols = true;
  colsDef!: ColDef[];

  defaultColDef: ColDef = {
    // width: 120,
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { fontSize: '9px' },
    flex: 1,
  };
  ngOnInit(): void {
    //debugger;
    this.colsDef = this.getColDefs();
    this.dataService.colsDefs$.next(this.colsDef);
    this.dataService.getRowData();

    this.dataService.applicantExist$.subscribe({
      next: (data) => {
        this.isapplicantExists = data;
      },
      error: console.log,
    });

    this.dataService.editMode$.subscribe({
      next: (data) => {
        this.isEditMode = data;
      },
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'item',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      searchPlaceholderText: 'Search',
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
    };

    this.dropdownList = this.dealers;
  }

  submit() {
    // debugger;
    this.dataService.removeLocalStorageItem('searchData');
    const searchParams: SearchParams = this.searchForm.getRawValue();
    if (!this.dataService.isSearchParamsEmpty(searchParams)) {
      this.dataService.setLocalStorageItem('searchData', searchParams);
      this.dataService.searchParams = searchParams;
      const userId = this.dataService.getLoggedInUserId();
      this.dataService.getSearchData(userId, searchParams);
    } else {
      this.dataService.getAllData(this.dataService.getLoggedInUserId());
    }

    // console.log(`searchparams ${JSON.stringify(searchParams)}`);
  }

  onReset() {
    this.searchForm.reset();
  }

  toggleChange(event: any) {
    this.showLessCols = event._checked ? true : false;
    if (this.showLessCols) {
      this.showMoreText = 'More';
    } else {
      this.showMoreText = 'Less';
    }
    const cols = this.getColDefs();
    this.dataService.colsDefs$.next(cols);
    this.onGridReady(this.params);
  }

  rowHeight(params: any) {
    if (params.node && params.node.detail) {
      // debugger;
      var offset = 80;
      var allDetailRowHeight =
        params.data.callRecords.length *
        params.api.getSizesForCurrentTheme().rowHeight;
      var gridSizes = params.api.getSizesForCurrentTheme();
      return allDetailRowHeight + gridSizes.headerHeight + offset;
    }
  }

  onClearApplicant() {
    this.dataService.currentApplicant = undefined;
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onClickLink() {
    debugger;
    alert('you click the link');
  }
  hideRow(event: any) {
    //debugger;
    const user = this.dataService.getLoggedInUser();
    this.dataService.updateAttribute(event.data, user, 'HIDE');
    // this.dataService.getAllData(this.dataService.getLoggedInUserId());
    this.dataService.getRowData();
    this.dialogData = 'Applicant Successfully Hidden';
    this.dataService.openSackBar(this.dialogData, 'ok');
  }

  onPinItem(data: any) {
    const { sk } = data.data;
    const userId = this.dataService.getLoggedInUserId();
    const pinItem = this.dataService.getPinnedApplicant(sk, userId);
    const requestBody = {
      pk: userId,
      sk,
      pinStatus: 'Y',
    };
    if (pinItem == undefined) {
      this.apiService.createPinnedApplicant(requestBody).subscribe({
        next: (data) => {
          this.dataService.pinItemRecentlyCreated = data;
          this.dataService.getRowData();
        },
        error: console.log,
      });
    } else {
      this.apiService.updatePinnedApplicant(pinItem).subscribe({
        next: (data) => {
          this.dataService.pinItemRecentlyCreated = data;
          this.dataService.getAllData(this.dataService.getLoggedInUserId());
        },
        error: console.log,
      });
    }
  }

  hideApplicant(data: any) {
    // debugger;
    const user = this.dataService.getLoggedInUser();
    const { pk, sk } = data;
    const currentApplicant = { pk, sk };
    this.dataService.updateAttribute(currentApplicant, user, 'HIDE');
    this.dataService.getAllData(this.dataService.getLoggedInUserId());
    this.dialogData = 'Applicant Successfully Hidden';
    this.dataService.openSackBar(this.dialogData, 'ok');
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
    //debugger;
    const { pk, sk } = row.data;
    this.dataService.applicantPk = pk;
    this.dataService.applicantSk = sk;
    this.dataService.isEditModeApplicant.set(true);
    this.setTemplate('applicant');
    this.dataService.primaryApplicant = row.data;
    this.dataService.editMode$.next(true);
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

  clearSearchField() {}

  onGridReady(params: any) {
    //debugger;
    //this.params = params;
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.gridColumnApi = params.columnApi;
    this.getRowHeight = this.rowHeight(params);
    this.autoSizeAll(false);
    this.sizeToFit();
  }

  onFirstDataRendered(params: any) {
    setTimeout(function () {
      params.api.getDisplayedRowAtIndex(0).setExpanded(true);
    }, 0);
  }

  onCellClicked(event: CellClickedEvent) {}

  btnClickedHandler(row: any) {
    //debugger;
    const { pk, sk } = row;
    // this.dataService.applicantPk = pk;
    // this.dataService.applicantSk = sk;
    // this.setTemplate('applicant');
    // this.dataService.primaryApplicant = row;
    // this.dataService.editMode$.next(true);
    //console.log(row);
  }

  public getRowStyle: (params: RowClassParams) => RowStyle | undefined = (
    params: RowClassParams
  ): RowStyle | undefined => {
    // debugger;
    if (params.data?.display == 'inactive') {
      return { color: 'red' };
      // return { fontWeight: 'bold' };
    }
    if (params.node.rowPinned === 'bottom') {
      return { 'background-color': '#ADD8E6' };
    }
    if (params.node.rowPinned === 'top') {
      return { 'background-color': '#FFFFCC' };
    }
    return { color: 'black' };
  };

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
      case 'applicantview': {
        this.container.createEmbeddedView(this.applicantview);
        break;
      }
      case 'vehicle': {
        this.container.createEmbeddedView(this.vehicle);
        break;
      }
      default: {
        // this.container.createEmbeddedView(this.employment);
        break;
      }
    }
  }

  setViewTemplate(row: any) {
    const { pk, sk } = row.data;
    this.dataService.applicantPk = pk;
    this.dataService.applicantSk = sk;
    this.setTemplate('applicantview');
  }

  setTemplate(val: string) {
    this.selectedUI = val;
    this.utility = CommonConstants.listOfUI[this.selectedUI];
    this.determineTemplate();
  }

  getColDefs(): ColDef[] {
    let coldfs: ColDef[];
    if (!this.showLessCols) {
      coldfs = [
        { field: 'pk', suppressColumnsToolPanel: true, hide: true },
        { field: 'sk', suppressColumnsToolPanel: true, hide: true },
        { field: 'gsI1PK', suppressColumnsToolPanel: true, hide: true },
        { field: 'gsI1SK', suppressColumnsToolPanel: true, hide: true },
        { field: 'display', suppressColumnsToolPanel: true, hide: true },
        { field: 'pinStatus', suppressColumnsToolPanel: true, hide: true },
        {
          field: 'relatedApplicantId',
          suppressColumnsToolPanel: true,
          hide: true,
        },
        {
          field: 'fullName',
          lockPosition: 'left',
        },

        { field: 'applicantType', headerName: 'Type' },
        { field: 'relatedTo', headerName: 'RelatedTo' },
        { field: 'city' },
        { field: 'province' },
        { field: 'phone' },
        { field: 'creditScore' },
        { field: 'assigned' },
        { field: 'verifiedStatus' },
        { field: 'dealStatus' },
        { field: 'dateCompleted' },
        { field: 'dateAssigned' },
        {
          field: 'action',
          cellRenderer: GridDeleteComponent,
          width: 350,
          // flex: 1,
        },
      ];
    } else {
      coldfs = [
        { field: 'pk', suppressColumnsToolPanel: true, hide: true },
        { field: 'sk', suppressColumnsToolPanel: true, hide: true },
        { field: 'gsI1PK', suppressColumnsToolPanel: true, hide: true },
        { field: 'gsI1SK', suppressColumnsToolPanel: true, hide: true },
        { field: 'display', suppressColumnsToolPanel: true, hide: true },
        { field: 'pinStatus', suppressColumnsToolPanel: true, hide: true },
        {
          field: 'relatedApplicantId',
          suppressColumnsToolPanel: true,
          hide: true,
        },
        {
          field: 'fullName',
          lockPosition: 'left',
        },

        { field: 'applicantType', headerName: 'Type' },
        { field: 'relatedTo', headerName: 'RelatedTo' },
        // { field: 'city' },
        // { field: 'province' },
        // { field: 'phone' },
        // { field: 'creditScore' },
        // { field: 'assigned' },
        { field: 'verifiedStatus' },
        { field: 'dealStatus' },
        { field: 'dateCompleted' },
        // { field: 'dateAssigned' },
        {
          field: 'action',
          cellRenderer: GridDeleteComponent,
          // flex: 1,
          width: 350,
        },
      ];
    }

    return coldfs;
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    debugger;
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
