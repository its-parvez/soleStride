export interface Product {
    _id: string;
    name: string;
    category: string;
    description : string;
    price: number;
    originalPrice?: number;
    stock: number;
    status: string;
    featured: boolean;
    featuredImage: {
        id: string,
        url: string,
    };
    rating: number;
    reviews: number;
    image: string;
    createdAt: string;
    sales: number;
}
