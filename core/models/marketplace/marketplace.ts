export interface MarketplaceEntry {
    foodName: string;
    needs: MarketplaceNeed[];
    providers: MarketplaceProvider[];
}

export interface MarketplaceNeed {
    username: string;
    quantity: number;
}

export interface MarketplaceProvider {
    username: string;
    quantity: number;
}
