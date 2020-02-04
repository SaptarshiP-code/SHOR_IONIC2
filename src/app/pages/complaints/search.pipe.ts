import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'status'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
   // console.log(value,"value")

    return value.filter((val) => {
      let rVal = (val.id.toLocaleLowerCase().includes(args)) || (val.status.toLocaleLowerCase().includes(args));
     // console.log(val,"val")
      return rVal;
    })

  }

}