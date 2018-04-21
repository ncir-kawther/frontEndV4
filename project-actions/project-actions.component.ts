import { Component, OnInit } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { OperationCall } from '../../operation-call';
import 'rxjs/Rx';

@Component({
  selector: 'app-project-actions',
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.css']
})
export class ProjectActionsComponent implements OnInit {

  public sub: any;
  public pname: any;
  public addLogdata: any;
  public addXSD: any;
  public urldata: any;
  data: any;
  public OperationsNotAdded: boolean;
  public OperationsAdded: boolean;
  private OperationsArray: Array<string> = [];
  private newAttribute: string;
  public jsonOperations: any;
  public jsonSelectedOperations: any;
  public operation: boolean;
  public uploadwsdlfile: boolean;
  public uploadwsdlurl: boolean;
  public displayOperations;
  public projname: string;
  public modify: boolean;
  public showActions: boolean;
  public serviceUrl: string;
  public wsdlfile: any;
  public jsonWsdl: any;
  public dataOps: any;
  public addLog: boolean;
  public successupload: boolean;
  public addCallSucc: boolean;
  public addXSDSucc: boolean;
  public addXSDfail: boolean;
  public addCallFail: boolean;
  public output: any;
  public downloadSuccess: boolean;
  public location: any;
  public url: any;
  public displayOperationsList: boolean;
  public SelectedOperations: Array<string> = [];
  public FinalOperations: Array<OperationCall> = [];
  WsdLOpsArray: Array<string> = [];
  elm: OperationCall = {};
  pclient: string;
  ptype: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router, private http: HttpClient) {

  }


  // tslint:disable-next-line:no-unused-expression
  ngOnInit(): void {
    // On Initi Show Only Division of Actions
    this.serviceUrl = '192.168.110.189';
    this.uploadwsdlfile = false;
    this.uploadwsdlurl = false;
    this.displayOperations = false;
    this.modify = true;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log(params);
        // Defaults to 0 if no query param provided.
        this.pname = params['project'];
        this.pclient = params['client'];
        this.ptype = params['type'];
        console.log(this.pname);
      });

    // tslint:disable-next-line:prefer-const
  }

  // Show Create Operations Div
  onOld(pname: string) {
    this.projname = pname;
    console.log(this.projname);
    this.operation = !this.operation;
    console.log(this.operation);
  }

  // Submitted Operations are about to be created
  onSubmitOp() {
    console.log(JSON.stringify(this.OperationsArray));
    // tslint:disable-next-line:max-line-length
    this.jsonOperations = '{"CreateOperations":{"ProjectName":"' + this.pname + '","OperationName":' + JSON.stringify(this.OperationsArray) + '}}';
    console.log(this.jsonOperations);

    // tslint:disable-next-line:max-line-length
    this.http.post('http://' + this.serviceUrl + ':8088/CreateOperation', this.jsonOperations).subscribe(data => {
      console.log(data);
      this.data = data;
      if (this.data.GenerateOperationResponse.Status === 'FAILED') {
        this.OperationsNotAdded = true;
        this.OperationsAdded = false;
        this.operation = false;
      }
      // tslint:disable-next-line:one-line
      else {
        this.OperationsAdded = true;
        this.OperationsNotAdded = false;
        this.operation = false;
      }
    });
  }

  // Add Operation to Temporary List
  addFieldValue() {
    console.log(this.OperationsArray);
    console.log(this.newAttribute);
    this.OperationsArray.push(this.newAttribute);
    this.newAttribute = '';
  }
  // Delete Operation From Temporary List
  deleteFieldValue(index) {
    console.log(index);
    this.OperationsArray.splice(index, 1);
  }

  // tslint:disable-next-line:one-line
  // Redirect to Add Ressources page, attaching Project Name in the Query

  // Redirect to Add Ressources page, attaching Project Name in the Query
  AddJMS() {
    this.router.navigate(['./jmsinvoke'], { queryParams: { project: this.pname, type: this.ptype, client: this.pclient } });
  }
  // Show Upload Wsdl Divs in the same page (file and url)
  UploadWSDL() {
    this.uploadwsdlfile = !this.uploadwsdlfile;
    this.uploadwsdlurl = !this.uploadwsdlurl;
  }

  // Detect Uploaded file and copy its content in wsdlfile variable
  fileChange(event) {
    this.uploadwsdlurl = false;
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        let text = reader.result;
        this.wsdlfile = text;
      };
      reader.readAsText(input.files[index]);
    }
  }
  // Loading file content from the Url in input
  LoadFromUrl(f: NgForm) {
    console.log(f.value.wsdlurl);
    this.uploadwsdlfile = false;
    this.http.get('http://' + this.serviceUrl + ':8094/WsdlFromUrl?WSDLURL=' + f.value.wsdlurl).subscribe(data => {
      this.urldata = data;
      this.wsdlfile = this.urldata.FromUrlOutput;
      this.jsonWsdl = this.wsdlfile;
      console.log(this.wsdlfile);
    });

  }

  // Submit the Uploaded Wsdl Content, Show contained operations in table
  onSubmitUpload(f: NgForm) {
    // tslint:disable-next-line:max-line-length
    this.http.post('http://' + this.serviceUrl + ':8091/CreateWsdl?projectName=' + this.pname + '&WsdlName=WSDL', this.wsdlfile).subscribe(data => {
      console.log(data);
      this.dataOps = data;
      console.log(this.dataOps.Operations.name);
      for (let i = 0; i < this.dataOps.Operations.name.length; i++) {
        this.WsdLOpsArray.push(this.dataOps.Operations.name[i]);
      }
      console.log(this.WsdLOpsArray[0]);

    });
    this.successupload = true;
    this.uploadwsdlurl = false;
    this.uploadwsdlfile = false;
    this.showActions = true;
    // this.displayOperations = false;
    this.modify = false;
    this.displayOperationsList = true;
  }

  // Show Action Buttons
  ShowActions() {
    this.modify = !this.modify;
  }
  // Detect checked and unchecked Operations and modify the temporary List
  OnChecked(Opname: string, check: boolean) {
    if (check === true) {
      this.SelectedOperations.push(Opname);
    }
    // tslint:disable-next-line:one-line
    else {
      const index: number = this.SelectedOperations.indexOf(Opname);
      if (index !== -1) {
        this.SelectedOperations.splice(index, 1);
      }
    }
  }

  // Choose Logs for Selected Operations
  SelectOperations() {
    this.addLog = true;
    this.displayOperationsList = false;
    for (const i of this.SelectedOperations) {
      // tslint:disable-next-line:prefer-const
      console.log(i);
      const element: OperationCall = {};
      element.opname = i;
      element.exception = false;
      element.info = false;


      this.FinalOperations.push(element);
    }
    console.log(JSON.stringify(this.FinalOperations));

  }
  // Check all Operations
  CheckAll(f: NgForm) {
    console.log(f.value);
    console.log(f.value.opnames);

  }

  // Log Info Choice
  chooseLogInfo(opselected: string, check: boolean) {
    if (check) {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].info = true;
      console.log(JSON.stringify(this.FinalOperations));
    }
    // tslint:disable-next-line:one-line
    else {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].info = false;
      console.log(JSON.stringify(this.FinalOperations));
    }
  }

  // Log Exception Choice
  chooseLogException(opselected: string, check: boolean) {
    if (check) {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].exception = true;
      console.log(JSON.stringify(this.FinalOperations));
    }
    // tslint:disable-next-line:one-line
    else {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].exception = false;
      console.log(JSON.stringify(this.FinalOperations));
    }
  }

  // Create selected Operations in project with choosen Logs
  SubmitOperationsToService() {
    this.addLog = false;

    this.jsonSelectedOperations = '{"SelectedOperations":{"List":' + JSON.stringify(this.FinalOperations) + '}}';
    console.log(this.jsonSelectedOperations);
    // tslint:disable-next-line:max-line-length
    this.http.post('http://192.168.110.186:8092/CreateCallOperation?ProjectName=' + this.pname, this.jsonSelectedOperations).subscribe(data => {
      console.log(data);
      this.addLogdata = data;
      if (this.addLogdata.Response === "Success") { this.addCallSucc = true; }
      // tslint:disable-next-line:one-line
      else { this.addCallFail = true; }
    });


  }
  //createxsd
  CreateXSD() {
    this.jsonSelectedOperations = '{"SelectedOperations":{"List":' + JSON.stringify(this.FinalOperations) + '}}';
    console.log(this.jsonSelectedOperations);
    this.http.post('http://192.168.110.189:9922/createXSD?project_name=' + this.pname, this.jsonSelectedOperations).subscribe(data => {
      console.log(data);
      console.log(JSON.stringify(this.SelectedOperations));

      if (this.SelectedOperations.length == 0)
        this.addXSDfail = true;
      else this.addXSDSucc = true;
    });
  }
  AddRessources(name: string) {
    this.router.navigate(['./addResources'], { queryParams: { project: name } });
  }
}
