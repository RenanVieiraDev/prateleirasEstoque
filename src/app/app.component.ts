import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'estoqueOrganizer';
  public firebaseConfig ={ 
    //configuração do firebase para o sistema se conectar com o Data base
  }

  ngOnInit(){
    // Initialize Firebase
    firebase.initializeApp(this.firebaseConfig);
  }

}
