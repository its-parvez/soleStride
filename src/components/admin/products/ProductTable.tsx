import { Edit, Trash2 } from 'lucide-react';
import React from 'react'

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    stock: number;
    status: string;
    featured: boolean;
    rating: number;
    reviews: number;
    image: string;
    createdAt: string;
    sales: number;
}


interface ProductTableProps {
    products: Product[];
    selectedProducts: string[];
    onSelectProduct: (productId: string) => void;
    onSelectAll: () => void;
    onDelete: (productId: string) => void;
}

export default function ProductTable({ products, selectedProducts, onSelectProduct, onSelectAll, onDelete }: ProductTableProps) {
    const allSelected = products.length > 0 && selectedProducts.length === products.length;


    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-4 text-left">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onSelectAll}
                                className="w-4 h-4 rounded border-gray-300 text-[#47B083] focus:ring-[#47B083]"
                            />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Stock</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Sales</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product:Product) => (
                        <tr key={product.createdAt} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                            <td className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => onSelectProduct(product.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#47B083] focus:ring-[#47B083]"
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                                            Img
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                                        {product.featured && (
                                            <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded text-xs">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.category}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-1">
                                    <span className="font-medium text-gray-900 dark:text-white">${product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                                            ${product.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.stock}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium `}>
                                     {product.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.sales}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
