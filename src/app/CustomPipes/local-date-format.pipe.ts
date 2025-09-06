import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDateFormat'
})
export class LocalDateFormatPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';
    const [date, time] = value.split('T');
    const [yyyy, MM, dd] = date.split('-');
    const [hh, mm] = time.split(':');
    return `${dd}-${MM}-${yyyy} ${hh}:${mm}`;
  }
}
