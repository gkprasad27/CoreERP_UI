import { Component, OnChanges, OnInit, SimpleChanges, Input} from'@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService} from '../../../../../services/api.service';
import { AlertService}from '../../../../../services/alert.service';
import { isNullOrUndefined } from 'util';
import { StatusCodes, SnackBar } from 'src/app/enums/common/common';
import { debug } from 'console';
import { CommonService } from '../../../../../services/common.service';

interface giftIsActive {
  value: string;
  viewValue: string;
}

@Component({
    selector:'gift-master',
    templateUrl:'./giftmaster.component.html',
    styleUrls:['giftmaster.component.scss']
})
export class GiftMasterComponent implements OnInit, OnChanges {
    modelFromData: FormGroup;
    productList:any=[];
    
    isFormEdit:boolean=false;
    isGiftmaster=true;
    formData:any;
    isFormVisible:boolean =false;
    gifttableDataList:any =[];
    statusList:giftIsActive[]=[{value:"true",viewValue:"Active"},{value:"false",viewValue:"InActive"}];
    yearArr:number[]=[new Date().getFullYear(),new Date().getFullYear()-1,new Date().getFullYear()-2];

@Input()
membercode:any;



    constructor(
        private apiService: ApiService,
        private apiConfigService: ApiConfigService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService,
        private fromBuilder:FormBuilder,
        private commonService: CommonService,
    ){

        this.modelFromData= this.fromBuilder.group({
            memberCode:[null],
            giftId:[null],
            status:[Boolean],
            issueDate:[null],
            description:[null],
            editWho:[null],
            addWho:[null],
            editDate:[null],
            addDate:[null],
            year:[Number],
            giftName:[null]
        });
       
    }
    ngOnChanges(changes: SimpleChanges): void {
       
    }
    ngOnInit(): void {
        this.getGiftProductList();
        this.setDefualts();
        this.getGiftList(this.membercode);
    }

    setDefualts(){
       let d=new Date();
        this.modelFromData.controls["issueDate"].setValue(d);
        this.modelFromData.controls["year"].setValue(d.getFullYear());
        this.modelFromData.controls["memberCode"].setValue(this.membercode);
        this.modelFromData.controls["status"].setValue(true);
        
    }
   
    getGiftProductList() {
        this.apiService.apiGetRequest(this.apiConfigService.getGiftProductList)
          .subscribe(
            response => {
               
              const res = response.body;
              if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!isNullOrUndefined(res.response)) {
                   //console.log(res);
                  this.productList = res.response['GiftProduct'];
                }
              }
              this.spinner.hide();
            }
          );
      }

    getGiftList(memberCode:any){
       this.apiService.apiGetRequest(this.apiConfigService.getGiftList+'/'+this.membercode)
           .subscribe(
              response=>{
             
                 const res=response.body;
                 if(!isNullOrUndefined(res) && res.status == StatusCodes.pass){
                     if(!isNullOrUndefined(res.response)){
                       this.gifttableDataList =res.response["Gifts"];
                     }
                 }
              }
            ,error=>{
                this.spinner.hide();
            }
           );
    }
    addOrUpdateEvent(value) {
      
        if (value.action == 'Edit') {

          this.formData = value.item;
          if (!isNullOrUndefined(this.formData)) {
            this.modelFromData.patchValue(this.formData);            
           // this.modelFromData.controls['giftId'].disable();
            this.modelFromData.controls["giftId"].setValue(this.formData.giftId);
            this.isFormEdit = true;
         }
        }
        this.isFormVisible=true;
    }

      save(){
         
        if (this.modelFromData.invalid) {
            return;
          }
          this.modelFromData.controls["memberCode"].setValue(this.membercode);
          if (!this.isFormEdit) {
            this.modelFromData.patchValue({
              issueDate: this.commonService.formatDate(this.modelFromData.get('issueDate').value)
            });
              this.apiService.apiPostRequest(this.apiConfigService.addGift,this.modelFromData.value)
              .subscribe(
                response => {
                  const res = response.body;
                  if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
                    if (!isNullOrUndefined(res.response)) {
                      this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                      this.reset();
                      this.getGiftList(this.membercode);
                    }
                  }
                  this.spinner.hide();
                }
              );

              this.isFormEdit=false;
          }
          else{
            this.modelFromData.patchValue({
              issueDate: this.commonService.formatDate(this.modelFromData.get('issueDate').value)
            });
            this.apiService.apiPostRequest(this.apiConfigService.updateGift,this.modelFromData.value)
            .subscribe(
              response => {
                const res = response.body;
                if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
                  if (!isNullOrUndefined(res.response)) {
                    this.alertService.openSnackBar('Record Updated successfully', 'close', SnackBar.success);
                    this.reset();
                    this.getGiftList(this.membercode);
                  }
                }
                this.spinner.hide();
                
              }
            );
          }

      }

      reset(){
          this.modelFromData.reset();
          this.setDefualts();
          this.isFormVisible=false;
      }
}