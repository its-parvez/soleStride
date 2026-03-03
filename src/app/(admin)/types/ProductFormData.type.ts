interface ProductFormData {
    //basic-info
    name: string;
    description: string;
    category: string;
    brand: string;

    //pricing
    price: number;
    originalPrice: number;
    taxRate: number;

    // Inventory
    sku: string;
    stock: number;
    lowStockThreshold: number;
    inStock: boolean;
    trackQuantity: boolean;

    // Variants
    sizes: string[];
    colors: string[];

    // Media
    images: {
        id: string;
        url: string;
    }[];
    featuredImage: {
        id: string;
        url: string;
    };

    // Shipping
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };

    // SEO
    seoTitle: string;
    seoDescription: string;
    slug: string;

    // Additional
    tags: string[];
    featured: boolean;
    status: "draft" | "active" | "archived";
}
