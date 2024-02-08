import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-affiliate-grid-actions',
  templateUrl: './affiliate-grid-actions.component.html',
  styleUrls: ['./affiliate-grid-actions.component.css'],
})
export class AffiliateGridActionsComponent
  implements OnInit, ICellRendererAngularComp
{
  params: any;
  componentParent: any;
  constructor() {}
  ngOnInit(): void {}
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
  setViewTemplate() {}

  deleteRow() {
    this.componentParent.deleteRow(this.params);
  }

  editRow() {
    this.componentParent.editRow(this.params);
  }
}
