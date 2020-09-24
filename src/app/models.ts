export class Message {
    constructor(
        public user: string,
        public date: string,
        public message: string
    ) { }
}

export interface Chat {
    id?: string,
    buyer: string,
    seller: string,
    product: string,
    messages: Message[]
}

export interface Product {
    id?: string,
    title: string,
    price: string,
    description: string,
    images: string[],
    vendor: string
}

export interface Voucher {
    buyer: string,
    name: string,
    quantity: number,
    vendor: string,
    id?: string
}

export interface Messages { 
    buyer: string; 
    product: string; 
    messages: Array<any>; 
    seller: string 
}

export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private tokenExpirationDate: Date
    ) {}

    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }
}

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    regreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}

export interface UserData {
    device: string;
    unread: number;
}

export interface completeAddress {
    address: string;
    lat: number;
    long: number;
}