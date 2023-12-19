import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date, ...args: unknown[]): unknown {
    return moment(value).format('MM/DD/YYYY');
  }
}
