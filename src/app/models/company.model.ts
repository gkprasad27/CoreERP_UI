export class Company {

    constructor(code?: string, name?: string, address1?: string, address2?: string, address3?: string, address4?: string, place?: string, state?: string, pinCode?: string, phone_1?: string,
        phone_2?: string, phone_3?: string, email?: string, panNo?: string, tanNo?: string, gstNo?: string, natureOfBusiness?: string, finacialYear?: number, fromMonth?: number, toMonth?: number) {


        this.code = code;
        this.name = name;
        this.address1 = address1;
        this.address2 = address2;
        this.address3 = address3;
        this.address4 = address4;
        this.place = place;
        this.state = state;
        this.pinCode = pinCode;
        this.phone_1 = phone_1;
        this.phone_2 = phone_2;
        this.phone_3 = phone_3;
        this.email = email;
        this.panNo = panNo;
        this.tanNo = tanNo;
        this.gstNo = gstNo;
        this.natureOfBusiness = natureOfBusiness;
        this.finacialYear = finacialYear;
        this.fromMonth = fromMonth;
        this.toMonth = toMonth;
    }


    
    public code: string;
    public name: string;
    public  address1: string;
    public address2: string;
    public address3: string;
    public address4: string;
    public place: string;
    public state: string;
    public pinCode: string;
    public phone_1: string;
    public phone_2: string;
    public phone_3: string;
    public email: string;
    public panNo: string;
    public tanNo: string;
    public gstNo: string;
    public natureOfBusiness: string;
    public finacialYear: number = 0;
    public fromMonth: number = 0;
    public toMonth: number = 0;
}
