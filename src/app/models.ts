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
    vendor: string,
    lat?: number,
    long?: number,
    bairro?: string,
    cidade?: string
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
        private tokenExpirationDate: Date,
        public address?: string,
        public cidade?: string,
        public bairro?: string,
        public lat?: number,
        public long?: number
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
    address?: string,
    cidade?: string,
    bairro?: string,
    lat?: number,
    long?: number
}

export interface completeAddress {
    address: string;
    cidade: string;
    bairro: string;
    lat: number;
    long: number;
}