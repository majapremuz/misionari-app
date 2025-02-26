import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const CACHE_FOLDER = 'CACHED-IMG';


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

   async getImage(imageUrl: string): Promise<string>{
    const imageName = imageUrl.split('/').pop() || '';
    const filetype = imageName?.split('.').pop();
    let image: string = '';

    let data = await Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`
    }).catch(err => {
      return undefined;
    });

    if(data != undefined){
      return `data:image/${filetype};base64,${data['data']}`;
    }else{
      // write the file
      await this.storeImage(imageUrl, imageName);

      let data_2 = await Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).catch(err => {
        return undefined;
      });

      if(data_2 != undefined){
        return `data:image/${filetype};base64,${data_2['data']}`;
      }else{
        return '';
      }
    }
   }

  // async getImage_old(imageUrl: string): Promise<string>{
  //   const imageName = imageUrl.split('/').pop() || '';
  //   const filetype = imageName?.split('.').pop();
  //   let image: string = '';

  //   Filesystem.readFile({
  //     directory: Directory.Cache,
  //     path: `${CACHE_FOLDER}/${imageName}`
  //   }).then(readFile => {
  //     image = `data:image/${filetype};base64,${readFile.data}`;
  //     return image;
  //   }).catch(async e => {
  //     // write the file
  //     await this.storeImage(imageUrl, imageName);

  //     Filesystem.readFile({
  //       directory: Directory.Cache,
  //       path: `${CACHE_FOLDER}/${imageName}`
  //     }).then(readFile => {
  //       image = `data:image/${filetype};base64,${readFile.data}`;
  //       return image;

  //     }).catch(err => {
  //       return image;
  //     })

  //   });

  //   //return image;
  // }

  async storeImage(url: string, path: string){
    const response = await fetch(url,{
      cache: 'no-store',
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*'
      }});

    const blob = await response.blob();

    const base64Data = await this.convertBlobToBase64(blob) as string;

    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache
    });
    return savedFile;
  }

  convertBlobToBase64(blob: Blob){
    return new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
