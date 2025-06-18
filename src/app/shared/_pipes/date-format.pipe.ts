import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@shared/_helpers/date.helper';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    return formatDate(value);
  }
}
