import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private messaging!: Messaging;

  constructor(private afMessaging: AngularFireMessaging) {
    this.initFirebase();
    this.initPush();
  }

  private initFirebase() {
    const app = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(app);
  }

  private initPush() {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        console.log('Permission granted! Save to the server!', token);
        // Send the token to your server to save it and use it for notifications
      },
      (error) => {
        console.error('Permission not granted:', error);
      }
    );

    this.afMessaging.messages.subscribe((message) => {
      console.log('Message received:', message);
      // Handle the message in your UI
    });

    onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      // Customize notification here
    });
  }

  subscribeToTopic(topic: string) {
    getToken(this.messaging, { vapidKey: 'BGixaLFlfOPRxPe2wAkZAjCxZzKcJe1epPvlp3gdkmGmqqV_Becmeur1k6HgouYwnx19fp7wdb1U2RGw7JQNSgI' }).then((currentToken) => {
      if (currentToken) {
        fetch(`https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/${topic}`, {
          method: 'POST',
          headers: new Headers({
            'Authorization': `key=YOUR_SERVER_KEY`
          })
        }).then(response => {
          if (response.status < 200 || response.status >= 400) {
            console.log('Error subscribing to topic:', response.status, response.statusText);
          } else {
            console.log('Subscribed to topic:', topic);
          }
        }).catch(error => {
          console.error('Error subscribing to topic:', error);
        });
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }
}
