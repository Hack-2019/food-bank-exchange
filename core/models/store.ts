export interface Stock {
    foods: StockItem[];
    username: string;
}

export interface StockItem {
    name: string;
    quantity: number;
}
