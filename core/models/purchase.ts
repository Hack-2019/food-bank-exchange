export class Purchase {
    id: string;
    items: PurchaseItem[];
}

export class PurchaseItem {
    productId: string;
    quantity: number;
}
