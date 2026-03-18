import { Locator, Page, expect } from "@playwright/test";
import { Billing } from "../model/billing";
import { Product } from '../model/product';
import { StringHelper } from "../utils/string-helper";
import { BasePage } from './base-page';

export class CheckoutPage extends BasePage {
    private readonly productTable: Locator;
    private readonly placeOrderButton: Locator; 
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly companyName: Locator;
    private readonly countryCombobox: Locator;
    private readonly streetAddress: Locator;
    private readonly postCode: Locator;
    private readonly townCity: Locator;
    private readonly phone: Locator;
    private readonly emailAddress: Locator;
    private readonly orderNotes: Locator;
    private readonly firstNameError: Locator;
    private readonly lastNameError: Locator;
    private readonly streetAddressError: Locator;
    private readonly townCityError: Locator;
    private readonly postCodeError: Locator;
    private readonly phoneError: Locator;
    private readonly emailError: Locator;
    private readonly firstNameErrorMsg: Locator;
    private readonly lastNameErrorMsg: Locator;
    private readonly streetAddressErrorMsg: Locator;
    private readonly townCityErrorMsg: Locator;
    private readonly postCodeErrorMsg: Locator;
    private readonly phoneErrorMsg: Locator;
    private readonly emailErrorMsg: Locator;
    
    constructor(page: Page) {
        super(page);
        this.productTable = page.getByRole('table');
        this.placeOrderButton = page.getByRole('button', { name: 'Place order' })
        this.firstName = page.getByRole('textbox', { name: 'First name *' });
        this.lastName = page.getByRole('textbox', { name: 'Last name *' });
        this.companyName = page.getByRole('textbox', { name: 'Company name (optional)' });
        this.countryCombobox = page.locator('#billing_country');
        this.streetAddress = page.getByRole('textbox', { name: 'Street address *' });
        this.postCode = page.locator('#billing_postcode');
        this.townCity = page.getByRole('textbox', { name: 'Town / City *' });
        this.phone = page.getByRole('textbox', { name: 'Phone *' });
        this.emailAddress = page.getByRole('textbox', { name: 'Email address *' });
        this.orderNotes = page.getByRole('textbox', { name: 'Order notes (optional)' });
        this.firstNameError = page.locator('p.woocommerce-invalid#billing_first_name_field');
        this.lastNameError = page.locator('p.woocommerce-invalid#billing_last_name_field');
        this.streetAddressError = page.locator('p.woocommerce-invalid#billing_address_1_field');
        this.townCityError = page.locator('p.woocommerce-invalid#billing_city_field');
        this.postCodeError = page.locator('p.woocommerce-invalid#billing_postcode_field');
        this.phoneError = page.locator('p.woocommerce-invalid#billing_phone_field');
        this.emailError = page.locator('p.woocommerce-invalid#billing_email_field');
        this.firstNameErrorMsg = page.locator('li[data-id="billing_first_name"]');
        this.lastNameErrorMsg = page.locator('li[data-id="billing_last_name"]');
        this.streetAddressErrorMsg = page.locator('li[data-id="billing_address_1"]');
        this.townCityErrorMsg = page.locator('li[data-id="billing_city"]');
        this.postCodeErrorMsg = page.locator('li[data-id="billing_postcode"]');
        this.phoneErrorMsg = page.locator('li[data-id="billing_phone"]');
        this.emailErrorMsg = page.locator('li[data-id="billing_email"]');
    }

    async getListProductOnYourOrder(): Promise<Product[]> {
        const products: Product[] = [];
        await this.productTable.waitFor({ state: 'visible' });
        const count = await this.productTable.locator('tbody').getByRole('row').count();
        for (let i = 0; i < count; i++) {
            const productRow = this.productTable.getByRole('row').nth(i);
            const productName = await productRow.getByRole('cell').nth(0).innerText();
            const productPriceText = await productRow.getByRole('cell').nth(1).innerText();
            products.push({ name: productName, price: productPriceText });
        }

        return products;
    }

    async checkProductInCart(product: Product) {
        await this.checkProductNameInCart(product.name);
        await this.checkProductPriceInCart(product.price);
    }

    async checkProductNameInCart(productName: string): Promise<void> {
        const products = await this.getListProductOnYourOrder();
        const productNames = products.map(p => p.name);
        expect(productNames.some(p => StringHelper.compareProductName(p, productName))).toBe(true);
    }

    async checkProductPriceInCart(productPrice: string): Promise<void> {
        const products = await this.getListProductOnYourOrder();
        const productPrices = products.map(p => p.price);
        expect(productPrices.some(p => p.includes(productPrice))).toBe(true);
    }

    async placeOrderProduct() {
        await this.placeOrderButton.click();
    }

    async checkCheckoutPageDisplayed(): Promise<void> {
        await expect(this.page).toHaveURL(/.*checkout.*/);
    }

    async fillFirstName(firstName: string) {
        await this.firstName.fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.lastName.fill(lastName);
    }

    async fillCompanyName(companyName: string) {
        if(companyName){
            await this.companyName.fill(companyName);
        }
    }

    async fillCountry(country: string) {
        if(country){
            await this.countryCombobox.selectOption({ label: country });
        }
    }

    async fillStreetAddress(address: string) {
        await this.streetAddress.fill(address);
    }

    async fillPostCode(postCode: string | number) {
        if(postCode){
            await this.postCode.fill(postCode.toString());
        }
    }

    async fillTownCity(townCity: string) {
        await this.townCity.fill(townCity);
    }   

    async fillPhone(phone: string) {
        await this.phone.fill(phone);
    }

    async fillEmailAddress(email: string) {
        await this.emailAddress.fill(email);
    }

    async fillOrderNotes(note?: string) {
        if (note) {
            await this.orderNotes.fill(note);
        }   
    }

    async fillBillingDetailsForm(billingDetails: Billing ): Promise<void> {
        await this.fillFirstName(billingDetails.firstName);
        await this.fillLastName(billingDetails.lastName);
        await this.fillCompanyName(billingDetails.companyName ?? '');
        await this.fillCountry(billingDetails.country);
        await this.fillStreetAddress(billingDetails.street);
        await this.fillPostCode(billingDetails.postCode ?? '');
        await this.fillTownCity(billingDetails.city);
        await this.fillPhone(billingDetails.phone);
        await this.fillEmailAddress(billingDetails.email);
        await this.fillOrderNotes(billingDetails.note);
    }

    async selectPaymentMethod(paymentMethod: string): Promise<void> {
        const option = this.page.getByRole('radio', { name: paymentMethod });
        await option.scrollIntoViewIfNeeded();
        await option.check();
    }

    async checkErrorMessageForFieldDisplayed(fieldName: string): Promise<void> {
        let errorLocator: Locator;

        switch (fieldName) {
            case 'firstName':
                errorLocator = this.firstNameErrorMsg;
                break;
            case 'lastName':
                errorLocator = this.lastNameErrorMsg;
                break;
            case 'street':
                errorLocator = this.streetAddressErrorMsg;
                break;
            case 'city':
                errorLocator = this.townCityErrorMsg;
                break;
            case 'postcode':
                errorLocator = this.postCodeErrorMsg;
                break;
            case 'phone':
                errorLocator = this.phoneErrorMsg;
                break;
            case 'email':
                errorLocator = this.emailErrorMsg;
                break;
            default:
                throw new Error(`Unhandled field name: ${fieldName}`);
        }

            expect(await errorLocator.isVisible()).toBe(true);
        }

    async checkFieldErrorHighlighted(fieldName: string): Promise<void> {
        let errorLocator: Locator;
        switch (fieldName) {
            case 'firstName':
                errorLocator = this.firstNameError;
                break;
            case 'lastName':
                errorLocator = this.lastNameError;
                break;
            case 'street':
                errorLocator = this.streetAddressError;
                break;
            case 'city':
                errorLocator = this.townCityError;
                break;
            case 'postcode':
                errorLocator = this.postCodeError;
                break;
            case 'phone':
                errorLocator = this.phoneError;
                break;
            case 'email':
                errorLocator = this.emailError;
                break;
            default:
                throw new Error(`Unhandled field name: ${fieldName}`);
        }
        await expect(errorLocator).toBeVisible({ timeout: 20000 });
    }
}

    

