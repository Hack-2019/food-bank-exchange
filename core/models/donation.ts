export interface Donation {
    items: DonationItem[];
}

export interface DonationItem {
    foodName: string;
    quantity: number;
}
