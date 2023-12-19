import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, RowClassParams, RowStyle } from 'ag-grid-community';
import { Affiliate } from 'src/app/interfaces/affiliate';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-affiliate-list',
  templateUrl: './affiliate-list.component.html',
  styleUrls: ['./affiliate-list.component.css'],
})
export class AffiliateListComponent implements OnInit {
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

  constructor(
    public dataService: DataService,
    public apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.context = {
      componentParent: this,
    };
  }

  colsDef: ColDef[] = [
    { field: 'pk', suppressColumnsToolPanel: true, hide: true },
    { field: 'sk', suppressColumnsToolPanel: true, hide: true },
    { field: 'gsI1PK', suppressColumnsToolPanel: true, hide: true },
    { field: 'gsI1SK', suppressColumnsToolPanel: true, hide: true },
    { field: 'affiliateName' },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'emial' },
    { field: 'phone' },
    { field: 'createdDate' },
    {
      field: 'action',
      // cellRenderer: GridDeleteComponent,
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
  }

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

  submit() {}
}
