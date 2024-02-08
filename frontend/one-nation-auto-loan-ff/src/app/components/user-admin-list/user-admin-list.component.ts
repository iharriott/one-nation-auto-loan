import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, RowClassParams, RowStyle } from 'ag-grid-community';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UserAdminGridActionsComponent } from '../user-admin-grid-actions/user-admin-grid-actions.component';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-admin-list',
  templateUrl: './user-admin-list.component.html',
  styleUrls: ['./user-admin-list.component.css'],
})
export class UserAdminListComponent implements OnInit, OnDestroy {
  context: any;
  searchForm!: FormGroup;
  private gridApi!: GridApi<User>;
  private gridColumnApi: any;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;
  @ViewChild('user', { static: true })
  public user!: TemplateRef<any>;
  getRowHeight: any;
  private editUserSubscription?: Subscription;
  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.context = {
      componentParent: this,
    };
  }

  colsDef: ColDef[] = [
    { field: 'pk', headerName: 'Organization' },
    { field: 'userName' },
    { field: 'sk', suppressColumnsToolPanel: true, hide: true },
    { field: 'gsI1PK', suppressColumnsToolPanel: true, hide: true },
    { field: 'gsI1SK', suppressColumnsToolPanel: true, hide: true },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'email' },
    { field: 'role' },
    {
      field: 'action',
      cellRenderer: UserAdminGridActionsComponent,
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
      case 'user': {
        this.container.createEmbeddedView(this.user);
        break;
      }
      default: {
        // this.container.createEmbeddedView(this.employment);
        break;
      }
    }
  }

  ngOnInit(): void {
    this.dataService.getAllUsers();
  }
  ngOnDestroy(): void {}

  onGridReady(event: any) {}

  onCellClicked(event: any) {}

  onFirstDataRendered(event: any) {}

  setTemplate(val: string) {
    this.determineTemplate(val);
  }

  editRow(row: any) {
    //debugger;
    const { pk, sk } = row.data;
    this.dataService.userPk = pk;
    this.dataService.userSk = sk;
    this.setTemplate('user');
    this.dataService.currentUser = row.data;
    //this.dataService.editMode$.next(true);
  }
}
