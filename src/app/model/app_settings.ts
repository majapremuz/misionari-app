import { environment } from "../../environments/environment";


export interface CompanySettingsApiInterface {
    items_per_page: number
    allow_register: string
    created: string
    updated: string
    author: string
    generator: string
    version: string
    webmaster: string
    db_version: string
    company_app_version: string | null
    company_app_version_display: string | null
    company_app_version_update: string
}

interface CompanySettingsInterface {
    items_per_page: number
    allow_register: boolean
    created: string
    updated: string
    author: string
    generator: string
    version: string
    webmaster: string
    db_version: string
    company_app_version: number
    company_app_version_display: string
    company_app_version_update: string
    show_message: boolean,
    show_update_page: boolean
}

export class CompanySettingsObject implements CompanySettingsInterface{
    items_per_page: number
    allow_register: boolean
    created: string
    updated: string
    author: string
    generator: string
    version: string
    webmaster: string
    db_version: string
    company_app_version: number
    company_app_version_display: string
    company_app_version_update: string
    show_message: boolean
    show_update_page: boolean

    constructor(data: CompanySettingsApiInterface){
        this.items_per_page = data.items_per_page;
        this.allow_register = (data.allow_register == 'Y' ? true : false);
        this.created = data.created;
        this.updated = data.updated;
        this.author = data.author;
        this.generator = data.generator;
        this.version = data.version;
        this.webmaster = data.webmaster;
        this.db_version = data.db_version;
        this.company_app_version = (data.company_app_version == null ? 0 : parseInt(data.company_app_version, 10));
        this.company_app_version_display = (data.company_app_version_display == null ? '' : data.company_app_version_display);
        this.company_app_version_update = data.company_app_version_update;
        this.show_message = false;
        this.show_update_page = false;

        const app_version = environment.app_version;

        if(this.company_app_version != 0 && app_version < this.company_app_version){
            //NOTHING, MESSAGE, FORCE
            if(this.company_app_version_update == 'MESSAGE'){
                this.show_message = true;
                this.show_update_page = false;
            }else if(this.company_app_version_update == 'FORCE'){
                this.show_message = false;
                this.show_update_page = true;
            }
        }
    }


}