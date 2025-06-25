import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitAndTrim',
  standalone: true,
})
export class SplitAndTrimPipe implements PipeTransform {
  transform(value: string): string[] {
    if (!value) return [];
    return value.split(',').map((s) => s.trim());
  }
}
