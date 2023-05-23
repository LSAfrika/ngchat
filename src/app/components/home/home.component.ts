import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public api:ApiService,public ui:UiService) { }

  ngOnInit(): void {
  }

  openlist(){
    this.ui.userlist=1
    console.log('ui modal',this.ui.userlist);

  }

}
