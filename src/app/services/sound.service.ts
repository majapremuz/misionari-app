import { Injectable } from '@angular/core';
import {NativeAudio} from '@capacitor-community/native-audio';
import { BehaviorSubject } from 'rxjs';

class sound {
  id:number = 0;
  url:string = '';
  duration:number = 0;
  play: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  soundId: number = 0;
  sounds: Array<sound> = [];
  interval: any = null;
  interval_duration: number = 200;

  soundData = new BehaviorSubject({
    id: 0,
    duration: 0,
    current_time: 0,
    current_time_str: '00:00',
    current_percent: 0,
    stop: false
  });

  constructor() { }

  async setInterval(){
    this.interval = setInterval(() => this.sendData(), this.interval_duration);
  }

  async sendData(){
    let sound = this.sounds.find(item => item.play == true);
    if(sound != undefined){
      let current_time = await this.currentTime(sound.id);
      let current_time_str = this.getStringTime(current_time);
      let current_percent = current_time / sound.duration * 100;
      let current_percent_round = Math.floor(current_percent);

      let data = {
        id: sound.id,
        duration: sound.duration,
        current_time: current_time,
        current_time_str: current_time_str,
        current_percent: current_percent_round,
        stop: false
      };

      let isPlaying = await this.isPlaying(sound.id);

      if(!isPlaying){
        data.stop = true;
        this.stop(sound.id);
      }

      this.soundData.next(data);
    }
  }

  clearInterval(){
    clearInterval(this.interval);
  }

  async preload(url: string): Promise<number>{
    let exist_sound = this.sounds.find(item => item.url == url);
    let id: number = 0;

    if(exist_sound == undefined){
      this.soundId++;
      await NativeAudio.preload({
        assetId: this.soundId.toString(),
        assetPath: url,
        audioChannelNum: 1,
        isUrl: true
      });
  
      await NativeAudio.play({
        assetId: this.soundId.toString()
      });
      
      let duration = await this.duration(this.soundId);
  
      await NativeAudio.stop({
        assetId: this.soundId.toString()
      });
  
      let sound: sound = {
        id: this.soundId,
        url: url,
        duration: duration,
        play: false
      };
  
      this.sounds.push(sound);
      id = this.soundId;
    }else{
      id = exist_sound.id;
    }
    return id;
  }

  setPlay(id: number, play: boolean){
    let sound = this.sounds.find(item => item.id == id);
    if(sound != undefined){
      sound.play = play;
    }
    if(play){
      this.setInterval();
    }else{
      this.clearInterval();
    }
  }

  async play(id: number){
    await NativeAudio.play({
      assetId: id.toString()
    });
    this.setPlay(id, true);
  }

  async isPlaying(id: number): Promise<boolean>{
    let data = await NativeAudio.isPlaying({
      assetId: id.toString()
    });
    return data.isPlaying;
  }

  async seek(id: number, time: number){
    await NativeAudio.play({
      assetId: id.toString(),
      time: time
    });
    this.setPlay(id, true);
  }

  async seekPercent(id: number, percent: number){
    let duration = this.getSoundDuration(id);
    let time: number = percent / 100 * duration;
    await this.seek(id, time);
  }

  async currentTime(id: number): Promise<number>{
    let time = await NativeAudio.getCurrentTime({
      assetId: id.toString()
    });
    return time.currentTime;
  }

  getSoundDuration(id: number): number{
    let sound = this.sounds.find(item => item.id == id);
    return sound?.duration || 0;
  }

  getStringTime(sec_input: number){
    let min = Math.floor(sec_input / 60);
    let sec = Math.floor(sec_input - (min * 60));
    let min_str: string = '00';
    let sec_str: string = '00';

    if(min == 0){
      min_str = '00';
    }else{
      if(min < 10) min_str = '0' + min.toString();
      else min_str = min.toString();
    }

    if(sec == 0){
      sec_str = '00';
    }else{
      if(sec < 10) sec_str = '0' + sec.toString();
      else sec_str = sec.toString();
    }

    return min_str + ':' + sec_str;
  }

  async duration(id: number): Promise<number>{
    let time = await NativeAudio.getDuration({
      assetId: id.toString()
    });
    return time.duration;
  }

  async unload(id: number){
    await this.stop(id);
    await NativeAudio.unload({
      assetId: id.toString()
    });
  }

  async stop(id: number){
    await NativeAudio.stop({
      assetId: id.toString()
    });
    this.setPlay(id, false);
  }
}
