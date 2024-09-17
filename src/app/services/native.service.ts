import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NativeService {

  constructor() { }

  openInBrowser(url: string){
    window.open(url, '_system', 'location=yes');
   }

   callNumber(number: string){
    return new Promise<Boolean>((res,rej)=>{
      window.open('tel:' + number);
      res(true);
    });
   }

   sendEmail(email: string){
    return new Promise<Boolean>((res,rej)=>{
      window.open('mailto:' + email, '_system');
      res(true);
    });
   }
}
