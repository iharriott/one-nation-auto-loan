import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, RowClassParams, RowStyle } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { Affiliate } from 'src/app/interfaces/affiliate';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { AffiliateGridActionsComponent } from '../affiliate-grid-actions/affiliate-grid-actions.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-affiliate-list',
  templateUrl: './affiliate-list.component.html',
  styleUrls: ['./affiliate-list.component.css'],
})
export class AffiliateListComponent implements OnInit, OnDestroy {
  context: any;
  searchForm!: FormGroup;
  private gridApi!: GridApi<Affiliate>;
  private gridColumnApi: any;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;
  @ViewChild('affiliate', { static: true })
  public affiliate!: TemplateRef<any>;
  getRowHeight: any;
  private addAffiliateSubscription?: Subscription;
  user!: string;

  constructor(
    public dataService: DataService,
    public apiService: ApiService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.context = {
      componentParent: this,
    };
  }

  colsDef: ColDef[] = [
    { field: 'pk', headerName: 'Affiliate' },
    { field: 'sk', suppressColumnsToolPanel: true, hide: true },
    { field: 'gsI1PK', suppressColumnsToolPanel: true, hide: true },
    { field: 'gsI1SK', suppressColumnsToolPanel: true, hide: true },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'email' },
    { field: 'phone' },
    { field: 'createdDate' },
    {
      field: 'action',
      cellRenderer: AffiliateGridActionsComponent,
      width: 280,
    },
  ];

  defaultColDef: ColDef = {
    width: 120,
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { fontSize: '9px' },
    flex: 1,
  };

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      affiliateName: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      createdStartDate: [],
      createdEndDate: [],
    });

    this.dataService.getAffiliateLeads();
  }

  // getAffiliateLeads() {
  //   this.user = this.dataService.getLoggedInUserId();
  //   this.apiService.getAffiliateLeads(this.user).subscribe({
  //     next: (data) => {
  //       console.log(`aff data ${JSON.stringify(data)}`);
  //       this.dataService.affiliateTableData$.next(data);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }

  onCellClicked($event: any) {}

  onReset() {
    this.searchForm.reset();
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

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady(params: any) {
    //debugger;
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.gridColumnApi = params.columnApi;
    this.getRowHeight = this.rowHeight(params);
    this.sizeToFit();
  }

  onFirstDataRendered(params: any) {
    setTimeout(function () {
      params.api.getDisplayedRowAtIndex(0).setExpanded(true);
    }, 0);
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

  determineTemplate(val: string) {
    this.container.clear();
    switch (val) {
      case 'affiliate': {
        this.container.createEmbeddedView(this.affiliate);
        break;
      }
      default: {
        // this.container.createEmbeddedView(this.employment);
        break;
      }
    }
  }

  setTemplate(val: string) {
    this.determineTemplate(val);
  }

  deleteRow(params: any) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
    });

    dialogRef.afterClosed().subscribe((data) => {
      debugger;
      if (data == 'delete') {
        const { pk, sk } = params.data;
        this.dataService.affiliatePk = pk;
        this.dataService.affiliateSk = sk;
        this.apiService.deleteAffiliateLead(pk, sk).subscribe({
          next: (data) => {
            var message = 'Affiliate Lead Deleted';
            this.dataService.showSucess(message);
            this.dataService.getAffiliateLeads();
          },
          error: (error) => {
            const message = 'Affiliate Lead delete Failed';
            this.dataService.showError(message);
          },
        });
      }
    });
  }

  editRow(params: any) {
    const { pk, sk } = params.data;
    this.dataService.affiliatePk = pk;
    this.dataService.affiliateSk = sk;
    this.dataService.isEditModeAffiliate.set(true);
    this.dataService.currentAffiliateLead$.next(params.data);
    this.setTemplate('affiliate');
  }

  submit() {}

  ngOnDestroy(): void {
    this.addAffiliateSubscription?.unsubscribe();
  }
}
