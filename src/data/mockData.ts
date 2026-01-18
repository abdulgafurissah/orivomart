export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    seller: string;
    image: string;
    rating: number;
}

export const products: Product[] = [
    {
        id: '1',
        name: 'High-Yield Maize Seeds',
        category: 'seeds',
        price: 4500,
        seller: 'AgroBest Nigeria',
        image: 'https://dummyimage.com/400x400/2ecc71/ffffff&text=Maize+Seeds',
        rating: 4.8,
    },
    {
        id: '2',
        name: 'NPK 15-15-15 Fertilizer',
        category: 'fertilizers',
        price: 18000,
        seller: 'GreenLife Supplies',
        image: 'https://dummyimage.com/400x400/f1c40f/000000&text=NPK+Fertilizer',
        rating: 4.5,
    },
    {
        id: '3',
        name: 'Glyphosate Weed Killer',
        category: 'pesticides',
        price: 6500,
        seller: 'FarmSafe Chem',
        image: 'https://dummyimage.com/400x400/e74c3c/ffffff&text=Weed+Killer',
        rating: 4.2,
    },
    {
        id: '4',
        name: 'Manual Knapsack Sprayer',
        category: 'equipment',
        price: 12000,
        seller: 'ToolMaster',
        image: 'https://dummyimage.com/400x400/34495e/ffffff&text=Sprayer',
        rating: 4.7,
    },
    {
        id: '5',
        name: 'Broiler Starter Feed',
        category: 'feed',
        price: 9500,
        seller: 'AnimalCare Ltd',
        image: 'https://dummyimage.com/400x400/e67e22/ffffff&text=Broiler+Feed',
        rating: 4.9,
    },
    {
        id: '6',
        name: 'Tomato Seeds (Hybrid)',
        category: 'seeds',
        price: 8000,
        seller: 'AgroBest Nigeria',
        image: 'https://dummyimage.com/400x400/c0392b/ffffff&text=Tomato+Seeds',
        rating: 4.6,
    },
    {
        id: '7',
        name: 'Urea Fertilizer',
        category: 'fertilizers',
        price: 16500,
        seller: 'GreenLife Supplies',
        image: 'https://dummyimage.com/400x400/bdc3c7/000000&text=Urea',
        rating: 4.4,
    },
    {
        id: '8',
        name: 'Cattle De-wormer',
        category: 'medicine',
        price: 3000,
        seller: 'VetWise',
        image: 'https://dummyimage.com/400x400/9b59b6/ffffff&text=De-wormer',
        rating: 4.8,
    },
    {
        id: '9',
        name: 'Hand Trowel',
        category: 'equipment',
        price: 1500,
        seller: 'ToolMaster',
        image: 'https://dummyimage.com/400x400/7f8c8d/ffffff&text=Trowel',
        rating: 4.3,
    },
    {
        id: '10',
        name: 'Insecticide (Lambda)',
        category: 'pesticides',
        price: 5000,
        seller: 'FarmSafe Chem',
        image: 'https://dummyimage.com/400x400/d35400/ffffff&text=Insecticide',
        rating: 4.5,
    },
];
