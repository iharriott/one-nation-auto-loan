import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-user-admin-grid-actions',
  templateUrl: './user-admin-grid-actions.component.html',
  styleUrls: ['./user-admin-grid-actions.component.css'],
})
export class UserAdminGridActionsComponent {
  params: any;
  componentParent: any;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    //throw new Error('Method not implemented.');
    return false;
  }
  deleteRow() {}

  editRow() {
    this.componentParent.editRow(this.params);
  }

  setViewTemplate() {}
}
