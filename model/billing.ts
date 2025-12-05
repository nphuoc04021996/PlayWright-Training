export class Billing {
    private readonly firstName: string;
    private readonly lastName: string;
    private readonly companyName?: string;
    private readonly country: string;
    private readonly street: string;
    private readonly apartmentInfo?: string;
    private readonly postCode?: number;
    private readonly city: string;
    private readonly phone: string;
    private readonly email: string;
    private readonly note?: string;

     constructor(
        firstName: string,
        lastName: string,
        country: string,
        street: string,
        city: string,
        phone: string,
        email: string,
        options?: {
            companyName?: string;
            postCode?: number;
            note?: string;
        }
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
        this.street = street;
        this.city = city,
        this.phone = phone,
        this.email = email
        if (options) {
            this.companyName = options.companyName;
            this.postCode = options.postCode;
            this.note = options.note;
        }
    }

}