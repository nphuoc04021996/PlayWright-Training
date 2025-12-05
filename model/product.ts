export class Product {
    private name: string;
    private price: string;
    private rate?: string;
    private category?: string;
    private decription?: string;

    constructor(name: string, price: string, rate?: string, category?: string, decription?: string) {
        this.name = name;
        this.price = price;
        if (rate !== undefined && rate !== null) this.rate = rate;
        if (category !== undefined && category !== null) this.category = category;
        if (decription !== undefined && decription !== null) this.decription = decription;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): string {
        return this.price;
    }

    public getRate(): string | undefined{
        return this.rate;
    }

    public getCategory(): string | undefined {
        return this.category;
    }

    public getDecription(): string | undefined {
        return this.decription;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setPrice(price: string) {
        this.price = price;
    }

    public setRate(rate: string) {
        this.rate = rate;
    }

    public setCategory(category: string) {
        this.category = category;
    }

    public setDecription(decription: string) {
        this.decription = decription;
    }
}