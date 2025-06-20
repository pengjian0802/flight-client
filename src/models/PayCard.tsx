export interface PayCard {
    id: number;
    userId: number;
    cardType: string;
    cardNumber: string;
    cvv: string;
    expireDate: string;
    cardHolderName: string;
}