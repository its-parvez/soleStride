"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query"
import Card from "@/components/ui/Card";
import { Product } from "@/types/product.types";



const fetchProducts = async () => {
    const res = await fetch("/api/products?status=active&featured=false")
    if (!res.ok) throw new Error("Failed to fetch products!")
    return res.json();
}

export default function MainShop() {

    const { data = [], isLoading, error } = useQuery({
        queryKey: ["Products"],
        queryFn: fetchProducts
    })


    const categoryMap: { [key: string]: Product[] } = {};
    data.forEach((product: Product) => {
        if (!categoryMap[product.category]) categoryMap[product.category] = [];
        categoryMap[product.category].push(product);
    });






    return (
        <div className="px-4 py-8 overflow-hidden max-w-7xl mx-auto">
            {isLoading ? "Loading ..." : Object.keys(categoryMap)?.map((categoryName, index) => (
                <section key={index} className="mb-12">
                    <h2 className="text-2xl font-bold text-[#47B083] dark:text-white mb-4">
                        {categoryName}
                    </h2>
                    <div className=" flex flex-col items-center sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            categoryMap[categoryName].map((product, index) => (
                                <Card key={index} productData={product} />
                            ))
                        }
                    </div>
                </section>
            ))}
        </div>
    );
}
