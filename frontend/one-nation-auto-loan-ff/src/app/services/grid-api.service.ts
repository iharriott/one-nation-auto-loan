import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GridApiService {
  private gridColumnApi: any;
  constructor() {}

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
}
