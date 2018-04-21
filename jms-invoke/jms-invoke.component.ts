import { OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, ControlContainer, FormGroup, FormControl } from '@angular/forms';
import { FocusModule } from 'angular2-focus';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, Inject, ViewChild, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import '../../../assets/charts/echart/echarts-all.js';



@Component({
  selector: 'app-jms-invoke',
  templateUrl: './jms-invoke.component.html',
  styleUrls: ['./jms-invoke.component.css'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class JmsInvokeComponent implements OnInit {
  public serviceUrl : String;
  dataprojects: any;
  dataclients : any;
  dataOperation : any;
  dataCreateProcess : any;
  ShowOperation : boolean;
  Operationclicked : boolean;
  ChoiceLogInfoExcepType : boolean;
  objUrl = {};
  objInv = {};
  objOp = {};
  objLogType = {};
  objCreate = {};
  private ProjectsArray: Array<any> = [];
  private ClientsArray: Array<any> = [];
  private OperationsArray: Array<any> = [];
 public SelectedProcess: String;
  public CallsAddedSucc: boolean;
  public CallsAddedFail: boolean;
  public JmsInvokeJson: string;
  public InvSynch:String="SynchronousInvokeCall";
  public InvAsynch:String="AsynchronousInvokeCall"
  public sub: any;
  public pname: any;
  public ptype :any;
  public pclient : any;

  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  constructor(  private route: ActivatedRoute,
    private router: Router, private http: HttpClient){

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
  this.serviceUrl = '192.168.110.229';
  this.sub = this.route
  .queryParams
  .subscribe(params => {
    //console.log(params);
    // Defaults to 0 if no query param provided.
    this.pname = params['project'];
    this.ptype = params['type'];
    this.pclient = params['client'];
    // console.log(this.pname);
    // console.log(this.ptype);
    // console.log(this.pclient);
  });

  this.Operationclicked = false;
  this.ChoiceLogInfoExcepType =false;
  this.GetProjects('userX');
  Object.assign(this.objUrl, {ClientName: "Oreedo",ProjectName:this.pname,ProjectType:this.ptype});
  // console.log(this.objUrl);

//  this.UtilsArray.push(this.pname,this.ptype,this.pclient);
}


GetProjects(username: string) {
  this.http.get('http://192.168.110.229:8084/GetProject?Username=' + username).subscribe(data => {
    this.dataprojects = data;
    for (const elt of this.dataprojects.resultSet.record) {
      this.ProjectsArray.push(elt);
    }
   // console.log(this.ProjectsArray);
  });
   //console.log(this.ProjectsArray);

}

invoquer(pname : String, cname : String, type : String){
  // console.log(pname);
  // console.log(cname);
  // console.log(type);
  this.http.get('http://192.168.110.229:7070/ShowOperation?projectName=' + pname + '&clientName=Oreedo&typeTemplate='+type).subscribe(data => {

    this.dataOperation = data;
    //console.log(data);
    this.Operationclicked=true;

});
Object.assign(this.objInv, {ClientNameInv: "Oreedo",ProjectNameInv:pname,ProjectTypeInv:type});
//console.log(this.objInv);


// console.log(this.UtilsArray)
}

// tslint:disable-next-line:max-line-length
CreateInvocationSynchone(TypeInv: String,pname:String,pclient:String,ptype:String,invName:String,InvClient:String,InvPtype:String,Operation:String){
  this.SelectedProcess = Operation;
  this.CallsAddedSucc = true;
console.log(TypeInv);
console.log(pname);
console.log(pclient);
console.log(ptype);
console.log(invName);
console.log(InvClient);
console.log(InvPtype);
console.log(Operation);


}
// tslint:disable-next-line:max-line-length
CreateInvocationAsynchrone(TypeInv: String,pname:String,pclient:String,ptype:String,invName:String,InvClient:String,InvPtype:String,Operation:String){
  this.SelectedProcess = Operation;
  this.CallsAddedSucc = true;
  console.log(TypeInv);
  console.log(pname);
  console.log(pclient);
  console.log(ptype);
  console.log(invName);
  console.log(InvClient);
  console.log(InvPtype);
  console.log(Operation);
  // tslint:disable-next-line:max-line-length
  this.http.get('http://192.168.110.229:7071/CreateInvocationProcess?TypeInvocation='+TypeInv+'&NomProject='+pname+'&NomClient=Oreedo&TypeProject='+ptype+'&NomProjectInvoquer='+invName+'&NomClientInvoquer=Oreedo&TypeProjectInvoquer='+InvPtype+'&NomOperation='+Operation).subscribe(data => {
    this.dataCreateProcess = data;
    console.log(data);
    if(this.dataCreateProcess.root.Status === "SUCCESS" ){  this.SelectedProcess = Operation;
      this.CallsAddedSucc = true; }
      else {
        this.CallsAddedFail = true;
      }

  });

}
GO(OperationName:String){
  // this.UtilsArray.push(OperationName);
  // console.log(this.UtilsArray);
  Object.assign(this.objOp, {OpName:OperationName});
  //console.log(this.objOp);
  this.ChoiceLogInfoExcepType =true;
    // this.JmsInvokeJson='{"Operation:{"OPname":"'+ OperationName'", "InvType":"'+ +'"}"}';
}

OnSubmit(Loginfo:boolean,LogExcep:boolean,Syn:boolean,Asyn:boolean){

  if (Loginfo)
  {
    Object.assign(this.objLogType, {LogInfo:"true"});

  }
  else{
    Object.assign(this.objLogType, {LogInfo:"false"});

  }
  if(LogExcep){
    Object.assign(this.objLogType, {LogExcep:"true"});

  }  else{
    Object.assign(this.objLogType, {LogExcep:"false"});

    }
  if(Syn){
    Object.assign(this.objLogType, {Syn:"true"});

  }  else{
    Object.assign(this.objLogType, {Syn:"false"});

    }
  if(Asyn){
    Object.assign(this.objLogType, {Asyn:"true"});

  }  else{
    Object.assign(this.objLogType, {Asyn:"false"});

    }
  Object.assign(this.objCreate, this.objUrl,this.objInv,this.objOp,this.objLogType);
  console.log(this.objCreate);
   console.log(JSON.stringify(this.objCreate));

   this.http.post('http://192.168.110.229:7071/CreateInvocationProcess',JSON.stringify(this.objCreate)).subscribe(data => {
     console.log(data);


   });
}
//http://localhost:7071/CreateInvocationProcess?TypeInvocation=AsynchronousInvokeCall&NomProject=Demo&NomClient=Oreedo&TypeProject=BP&NomProjectInvoquer=Tibco_Portability_BP&NomClientInvoquer=Oreedo&TypeProjectInvoquer=BP&NomOperation=AddNumbersToPool
//onSubmit(f: NgForm) {    NomProject,NomClient  ,,TypeProject,NomProjectInvoquer,NomClientInvoquer,TypeProjectInvoquer,NomOperation
  //console.log( f.value.oname);

  // tslint:disable-next-line:max-line-length
//   this.http.get('http://' + this.serviceUrl + ':8089/CreateProject?ProjectName=' + f.value.pname + '&ClientName=' + f.value.cname + '&ProjectType=' + f.value.ptype + '&UserName=Hejer').subscribe(data => {
//   console.log(data);
//   this.data = data;
// console.log(this.data.GenerateProjectResponse.Status);
// this.ProjectName = f.value.pname;
//
// if (this.data.GenerateProjectResponse.Status === 'FAILED') {
//   this.showdivsucc = false;
//   this.showdivfail = true;
// this.addnew = false; }
//
// else {
//   this.showdivfail = false;
//   this.showdivsucc = true;
//   this.addnew = false;
//
//      }});
//  }
}
