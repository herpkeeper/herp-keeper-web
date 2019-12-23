import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(value: any, type = 'text'): any {
    switch (value.toUpperCase()) {
    case 'M':
      return type === 'icon' ? 'mars' : 'male';
    case 'F':
      return type === 'icon' ? 'venus' : 'female';
    default:
      return type === 'icon' ? 'question' : 'unknown';
    }
  }

}
