import { tap } from 'rxjs/operators';
import { MessagesService } from './../../services/messages.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, switchMap, map, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { userfetch, personalcontacts } from 'src/app/interface/user.interfaces';
import { IOService } from 'src/app/services/io.service';
import { UiService } from 'src/app/services/ui.service';
import { UserService } from 'src/app/services/user.service';
import { participant } from 'src/app/interface/messages.interface';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  username=''
  allcontacts=0
  destroy$:Subject<boolean>=new Subject()
  personalcontacts=false
  @ViewChild('contactslist') private myScrollContainer: ElementRef;

  count=this.user.searchvalue.pipe(switchMap((queryvalue:userfetch)=>{

   return this.user.fetchcount(queryvalue.searchtext)
  }),map((res:any)=>res.totalusers as number)

  )

  // usercontactlist=this.user.fetchfavoritecontactlist()
  users=this.user.searchvalue.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((queryvalue)=>
      this.user.fetchallusers(queryvalue.searchtext,queryvalue.pagination)
    ),
    map((res:any)=>  {this.allcontacts=res.users.length; ;
     return res.users}),
     map((contacts:personalcontacts[])=>{

    const contactsuserids=  this.ui.personalcontacts.value.map(user=> user._id)
    console.log('list of favorite users',contactsuserids);



return contacts.map(contact=>{
  if(contactsuserids.indexOf(contact._id)==-1)contact.favorited=false
  if(contactsuserids.indexOf(contact._id)!=-1)contact.favorited=true

  // console.log(contact)
  return contact

})
      })

    )
    constructor(public ui:UiService,private io:IOService,private user:UserService,private msgservice:MessagesService) {
    this.io.setsocketinstance()

    console.log('fav contacts initial list',this.ui.personalcontacts.value);

   if(this.ui.personalcontacts.value == undefined) this.user.fetchfavoritecontactlist().pipe(takeUntil(this.destroy$)).subscribe((res:personalcontacts[])=>{console.log('personal contact list:',res),this.ui.personalcontacts.next(res)})
    // this.user.searchvalue.subscribe(console.log)

    }

    ngOnInit(): void {


    }
    ngOnDestroy(){
      this.user.searchvalue.next({searchtext:'',pagination:this.user.searchvalue.value.pagination})
      this.destroy$.next(true)
      this.destroy$.complete()
      this.destroy$.unsubscribe()
    }

    viewprofile()
{
  this.ui.viewprofile$.next(true)
  console.log('profile component view: ',this.ui.viewprofile$.value);

}
    togglecontacts(){
      this.personalcontacts=!this.personalcontacts
    }


    favoriteacontact(uid){
      this.user.addremoveforiteuser(uid).pipe(tap(res=>console.log(res)),takeUntil(this.destroy$)).subscribe()

    }

    searchvalue(event){
      this.user.searchvalue.next({searchtext:event.target.value,pagination:1})
      // console.log(this.user.searchvalue.value);

    }

    fetchuserchat(chatparticipantid:string,chatingwith){

      this.ui.chatingwith=chatingwith
      console.log(chatparticipantid);
      this.ui.activechat$.next(true)
  this.fetchcurrentchat(chatparticipantid)


    }

    fetchcurrentchat(chatparticipantid){
      console.log('contacts id',chatparticipantid);


      if(this.ui.chatingwith._id==this.ui.currentchatuserid){this.closecontacts(); return}
      this.msgservice.chatthread$.next([])

      this.msgservice.fetchthread(chatparticipantid).pipe(tap(res=>this.msgservice.chatthread$.next(res)),takeUntil(this.destroy$)).subscribe(
        ()=>{

       console.log('thread',this.msgservice.chatthread$.value);
      this.closecontacts()

      this.ui.currentchatuserid=chatparticipantid
       this.ui.scrolltobottomdesktop$.next(1)

        }
       )

    }

  openaddcontactmodal(){
    this.ui.contactmodal.next(true)
  }

  closecontactmodal(){
    this.ui.contactmodal.next(false)

  }
    closecontacts(){
      this.ui.initialposition=2



    }
    fetchmoreusers(){
      this.user.searchvalue.next({searchtext:this.user.searchvalue.value.searchtext,pagination:this.user.searchvalue.value.pagination+1})
      this.scrollToBottom()
    }

    identify(index, item){
      return item._id;
   }

   scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollToBottom = this.myScrollContainer.nativeElement.scrollHeight;
        console.log('scroll being called value:',this.myScrollContainer.nativeElement.scrollHeight);

    } catch (err) {
      console.log(err.message);

     }
  }

  endedtest(){
    console.log('ended test works');

  }


}
