export interface ISMSAPIOptions {
    publicKey: string;
    privateKey: string;
    url: string;
    testMode?: boolean;
    version?: string;
}
export declare class SMSAPI {
    private static DEFAULT_VERSION;
    private publicKey;
    private privateKey;
    private url;
    private version;
    private testMode;
    constructor(options: ISMSAPIOptions);
    private removeTrailingSlash;
    private calcMD5;
    private request;
    private sanitizeParams;
    private processResponce;
    send<T>(action: any, params: any): Promise<T>;
}
export declare class Addressbook {
    private gateway;
    constructor(gateway: SMSAPI);
    addAddressbook(params: {
        name: string;
        description?: string;
    }): Promise<{
        result: {
            addressbook_id: number;
        };
    }>;
    delAddressbook(params: {
        idAddressBook: number;
    }): Promise<unknown>;
    editAddressbook(params: {
        idAddressBook: number;
        newName: string;
        newDescr: string;
    }): Promise<unknown>;
    getAddressbook(params: {
        idAddressBook?: number;
        from?: number;
        offset?: number;
    }): any;
    searchAddressBook(params: {
        searchFields?: any;
        from?: number;
        offset?: number;
    }): Promise<unknown>;
    cloneaddressbook(params: {
        idAddressBook: number;
    }): Promise<unknown>;
    addPhoneToAddressBook(params: {
        idAddressBook: number;
        phone: number;
        variables?: string;
    }): Promise<unknown>;
    addPhonesToAddressBook(params: {
        idAddressBook: number;
        data: {
            phone: number;
            variables?: string;
        };
    }): Promise<unknown>;
    getPhoneFromAddressBook(params: {
        idAddressBook?: number;
        idPhone?: number;
        phone?: number;
        from?: number;
        offset?: number;
    }): Promise<unknown>;
    delPhoneFromAddressBook(params: {
        idAddressBook: number;
        idPhone: number[];
    }): Promise<unknown>;
    delphonefromaddressbookgroup(params: {
        idPhones: number[];
    }): Promise<unknown>;
    editPhone(params: {
        idPhone: number;
        phone: string;
        variables: string;
    }): Promise<unknown>;
    searchPhones(params: {
        searchFields: any;
        from: number;
        offset: number;
    }): Promise<unknown>;
}
export declare class Stat {
    private gateway;
    constructor(gateway: SMSAPI);
    createCampaign(params: {
        sender?: string;
        text?: string;
        list_id?: number;
        datetime?: string;
        batch?: number;
        batchinterval?: number;
        sms_lifetime?: number;
        control_phone?: number;
    }): Promise<unknown>;
    sendSMS(params: {
        sender: string;
        text?: string;
        phone?: string;
        datetime?: string;
        sms_lifetime?: number;
    }): Promise<unknown>;
    sendSMSGroup(params: {
        sender?: string;
        text?: string;
        phones?: number[];
        datetime?: string;
        sms_lifetime?: number;
    }): Promise<unknown>;
}
