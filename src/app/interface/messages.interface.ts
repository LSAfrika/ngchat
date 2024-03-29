export interface Usermessages{
messages:[Message]
}

export interface Message{
  message:string,
  from:string,
  _id?:string
   to?:string
   deletechat?:[string]
   viewed?:boolean,
   createdAt?:Date
}

export interface chatlist{

  _id:string
  chatupdate:number
  chatparticipants:[participant]
  unreadcounter:[{userid:string,count:number}]
  lastmessage:string



}

export interface participant{
  _id:string,
  username:string,
  profileimg:string
  lastseen:number
  online:boolean
  status?:string
}
