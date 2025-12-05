import { BasePage } from './base-page';


export class HomePage  extends BasePage {
    async gotoHomePage(){
        await this.page.goto('/',{waitUntil :'domcontentloaded'});
    }
}
