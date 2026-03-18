export class Utils {
    public static generateRandomNumber(maxNumber: number): number {
        return Math.floor(Math.random() * maxNumber);
    } 

    public static normalize(text: string): string { return text.replace(/\s+/g, ' ').trim(); } 

    public static normalizePrice(price: string): string { return price.replace(/\s/g, ''); }

    public static convertJsonDataToObject<T>(data: any): T {
        return data as T;
    }

    public static getCurrentDateTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    }
}