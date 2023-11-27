import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-grid-delete',
  templateUrl: './grid-delete.component.html',
  styleUrls: ['./grid-delete.component.css'],
})
export class GridDeleteComponent implements OnInit, ICellRendererAngularComp {
  componentParent: any;
  icon = faTrash;
  iconPencil = faPencil;
  params: any;
  isPinned!: boolean;
  isDisplay!: string;
  ngOnInit(): void {}

  hideRow() {
    this.componentParent.hideRow(this.params);
  }

  deleteRow() {
    this.componentParent.deleteRow(this.params);
  }

  editRow() {
    this.componentParent.editRow(this.params);
  }

  onPinItem() {
    this.componentParent.onPinItem(this.params);
  }

  setViewTemplate() {
    debugger;
    this.componentParent.editRow(this.params);
    this.componentParent.setViewTemplate();
  }

  agInit(params: ICellRendererParams): void {
    //debugger;
    this.params = params;
    this.componentParent = this.params.context.componentParent;
    this.isDisplay = this.params.data.display;
    this.isPinned = this.params.data.pinStatus == 'Y' ? true : false;

    console.log(`parmas ${params.data}`);

    //this.value = params.value;
    //this.buttonText = params.buttonText ?? 'Default';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  edit(event: any) {}
}
