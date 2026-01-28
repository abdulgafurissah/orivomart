
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    shopId: string;
    image: string;
    rating: number;
    description: string;
}

export interface Shop {
    id: string;
    name: string;
    slug: string;
    owner: string;
    coverImage: string;
    avatar: string;
    description: string;
}

export const shops: Shop[] = [
    {
        id: 'shop_1',
        name: 'Tech Haven',
        slug: 'tech-haven',
        owner: 'John Doe',
        coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop',
        avatar: 'https://images.unsplash.com/photo-1531297461136-82lwDe83a9z?q=80&w=2688&auto=format&fit=crop',
        description: 'Best electronics and gadgets in Accra.'
    },
    {
        id: 'shop_2',
        name: 'Afro Chic',
        slug: 'afro-chic',
        owner: 'Sarah Mensah',
        coverImage: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop',
        avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1886&auto=format&fit=crop',
        description: 'Modern African fashion and accessories.'
    }
];

export const products: Product[] = [
    {
        id: 'p1',
        name: 'Wireless Headphones',
        category: 'electronics',
        price: 350,
        shopId: 'shop_1',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        rating: 4.5,
        description: 'Noise cancelling wireless headphones with 20h battery life.'
    },
    {
        id: 'p2',
        name: 'Kente Print Dress',
        category: 'clothing',
        price: 120,
        shopId: 'shop_2',
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1934&auto=format&fit=crop',
        rating: 5.0,
        description: 'Beautiful handmade Kente print dress.'
    },
    {
        id: 'p3',
        name: 'Smart Watch',
        category: 'electronics',
        price: 250,
        shopId: 'shop_1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
        rating: 4.0,
        description: 'Track your fitness and notifications.'
    }
];
