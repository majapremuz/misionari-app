import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, RangeCustomEvent } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class AudioComponent  implements OnInit {

  @Input() url: string = '';


  soundId: number = 0;
  soundDuration: string = '00:00';
  soundLabel: string = '00:00/00:00';
  icon: string = '';
  preload: boolean = false;
  play: boolean = false;
  time: number = 0;
  sliderValue: number = 0;
  sliderDisable: boolean = false;

  constructor(
    private soundCtrl: SoundService,
    private dataCtrl: ControllerService
  ) { }

  async ngOnInit() {
    this.setIcon('play');

    this.soundCtrl.soundData.subscribe(item => {
      if((item?.id || null) != undefined){
        if(item?.id == this.soundId){
          if(item.stop == true){
            this.play = false;
            this.setIcon('play');
            this.time = 0;
            this.generateSoundLabel(0);
            this.sliderValue = 0;
          }else{
            if(!this.sliderDisable){
              this.generateSoundLabel(item.current_time);
              this.sliderValue = item.current_percent;
            }
          }
        }
      }
    });
  }

  userDragging(event: RangeCustomEvent){
    this.sliderDisable = true;
  }

  async playSound(){
    await this.preloadSound();
    if(!this.play){
      this.play = true;
      this.setIcon('stop');

      if(this.time > 0){
        await this.soundCtrl.seek(this.soundId, this.time);
      }else{
        await this.soundCtrl.play(this.soundId);
      }

    }else{
      this.play = false;
      this.setIcon('play');
      let time = await this.soundCtrl.currentTime(this.soundId);
      this.time = time;
      await this.soundCtrl.stop(this.soundId);
    }
  }

  async preloadSound(){
    if(!this.preload){
      this.preload = true;
      this.soundId = await this.soundCtrl.preload(this.url);
      let soundDuration = this.soundCtrl.getSoundDuration(this.soundId);
      this.soundDuration = this.soundCtrl.getStringTime(soundDuration);
      this.generateSoundLabel(0);
    }
  }

  async seekPlay(event: RangeCustomEvent){
    this.sliderDisable = false;
    this.play = true;
    this.setIcon('stop');
    await this.preloadSound();
    let percent: number = event.detail.value as number;
    await this.soundCtrl.seekPercent(this.soundId, percent);
  }

  generateSoundLabel(currentTime: number){
    let startString = this.soundCtrl.getStringTime(currentTime);
    this.soundLabel = startString + '/' + this.soundDuration;
  }

  setIcon(icon: 'play' | 'stop'){
    if(icon == 'play'){
      this.icon = 'play-outline';
    }else{
      this.icon = 'stop-outline';
    }
  }

  ngOnDestroy(){
    if(this.soundId > 0){
      this.soundCtrl.stop(this.soundId);
      this.soundCtrl.unload(this.soundId);
      this.soundCtrl.soundData.unsubscribe();
    }
  }

}
