"use client";
import { useState } from "react";
import { Plus, Star, Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function allcategoryandbrands() {
    const router = useRouter();
    const queryClient = useQueryClient();


    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
    });

    const { data: brands = [] } = useQuery({
        queryKey: ["brands"],
        queryFn: async () => {
            const res = await fetch("/api/brands");
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
    });




    const getSubcategories = (parentId: string) => {
        return categories.filter((cat: Category) => cat.parentId === parentId);
    };





    const mainCategories = categories.filter((cat:Category) => cat.level === 0);
     
    console.log(categories)

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Categories & Brands
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your products Brand and category
                    </p>
                </div>

            </div>

            {/* Categories & brands Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        category ({categories.length})
                    </h2>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {categories.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                No categories added yet
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {/* Main Categories */}

                                {
                                    mainCategories.map((category: Category) => (
                                        <div key={category.id}>
                                            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                                            📁 {category.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Lorem ipsum dolor sit amet consectetur, adipisicing
                                                            elit. Minima, asperiores!
                                                        </p>
                                                    </div>
                                                </div>

                                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer">
                                                    <Trash2 size={22} />
                                                </button>
                                            </div>

                                            {
                                                getSubcategories(category.id).map((subCategory: Category) => (
                                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg ml-8 mt-2 bg-white dark:bg-gray-800">
                                                        <div className="flex items-center space-x-4">
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                                    └─ 🏷️ {subCategory.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Lorem ipsum dolor sit amet consectetur adipisicing
                                                                    elit. Laboriosam, labore?
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </div>

                {/* Brands Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Brands ({brands.length})
                    </h2>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {brands.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                No Brands added yet
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {/*Brands */}

                                {
                                    brands.map((brand: Brand, index: string) => (<div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    📁 (Main)
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Lorem ipsum dolor sit amet consectetur, adipisicing
                                                    elit. Minima, asperiores!
                                                </p>
                                            </div>
                                        </div>

                                        <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer">
                                            <Trash2 size={22} />
                                        </button>
                                    </div>))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
