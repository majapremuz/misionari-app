import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { IonicModule, IonSpinner } from '@ionic/angular';

const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'app-cached-image',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class CachedImageComponent  implements OnInit {

  _src = '';
  constructor() { }

  ngOnInit() {}

  @Input()
  set src(imageUrl: string){
    const imageName = imageUrl.split('/').pop() || '';
    const filetype = imageName?.split('.').pop();

    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`
    }).then(readFile => {
      this._src= `data:image/${filetype};base64,${readFile.data}`;
    }).catch(async e => {
      // write the file
      await this.storeImage(imageUrl, imageName);

      Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).then(readFile => {
        this._src= `data:image/${filetype};base64,${readFile.data}`;
      });
    });
  }

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
