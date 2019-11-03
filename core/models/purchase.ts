export interface Purchase {
    id: string;
    items: PurchaseItem[];
}

export interface PurchaseItem {
    foodName: string;
    quantity: number;
}
