
export class Constants{

    //base_url
    public static readonly baseURL: string = `http://localhost:3000/`;

    //Regex's
    public static readonly nameReg: any = /^([a-zA-Z]{1,}([ ])?[a-zA-Z]{1,})*[a-zA-Z]{1,}([ ])?[a-zA-Z]{1,}$/;
    public static readonly passwordReg: any = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{8,}$/;
    public static readonly emailReg: any = /^[a-zA-Z]{1,}([._-])?[a-zA-Z0-9]{1,}([._-])?[a-zA-Z0-9]{1,}([._-])?[a-zA-Z0-9]{1,}([._-])?[a-zA-Z0-9]{1,}([_-]{1})?[a-zA-Z0-9]{1,}[@]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}([.]{1}[a-zA-Z]{2})?$/;

    //Error message
    public static readonly blank: string = ''
    public static readonly required: string = 'Required'
    public static readonly nameErr: string = 'Only Aphabet is allowed.'
    public static readonly emailErr: string = 'Invalid email.'
    public static readonly dobErr: string = 'Please Provide valid dob.'
    public static readonly passwordErr: string = 'password should have min 8 character, atleast 1 number and 1 alphabet.'
}