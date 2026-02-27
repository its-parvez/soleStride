"use client";

import React, { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
interface Product {
    _id: string;
    name: string;
    category: string;
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


export default function MainShop() {
    const [products , setProducts] = useState<Product[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)


    const fetchPost = async () => {
        setLoadingProducts(true)
        try {
            const res = await fetch('/api/products')
            const ProductsData = await res.json();
            setProducts(ProductsData)
            
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoadingProducts(false);
        }

    }

        useEffect(() => {
            fetchPost();
       
        }, [])
    

    return (
        <div className="px-4 py-8 overflow-hidden max-w-7xl mx-auto">
            {products?.map((category) => (
                <section key={category.name} className="mb-12">
                    <h2 className="text-2xl font-bold text-[#47B083] dark:text-white mb-4">
                        {category.name}
                    </h2>
                    <div className=" flex flex-col items-center sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* {category.items.map(( item , index:number) => (
                            <Card key={index}/>
                        ))} */}
                    </div>
                </section>
            ))}
        </div>
    );
}
