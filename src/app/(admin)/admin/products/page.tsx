'use client';
import { useEffect, useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    Download,
    Upload,
    Star,
    Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProductTable from '@/components/admin/products/ProductTable';
import NotFoundProduct from '@/components/admin/products/NotFoundProduct';
import Link from 'next/link';


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


interface Category {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  level: number;
  highlight: boolean;
}

export default function AllProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [categories , setCategories] = useState<Category[]>([])
    
    


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



    // Filter products based on search and filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'price-high':
                return b.price - a.price;
            case 'price-low':
                return a.price - b.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'sales':
                return b.sales - a.sales;
            default:
                return 0;
        }
    });

    
    const statuses = ['all', 'active', 'out-of-stock', 'low-stock'];

    const fetchCategories = async () => {

        try {
            const res = await fetch("/api/categories")
            const data = await res.json();
            // console.log(data)
            setCategories(data)
        
        }
        catch (error) {
            console.log(error)
        }



    }

    const toggleProductSelection = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleAllSelection = () => {
        setSelectedProducts(prev =>
            prev.length === sortedProducts.length
                ? []
                : sortedProducts.map(p => p._id)
        );
    };

    const deleteProduct = (productId: string) => {
        // setProducts(prev => prev.filter(p => p.id !== productId));
        // setSelectedProducts(prev => prev.filter(id => id !== productId));
        console.log(productId)
    };


    useEffect(() => {
        fetchPost();
        fetchCategories();

    }, [])



    return (

        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Products</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your product catalog and inventory
                    </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                        <Upload size={18} />
                        <span>Import</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                        <Download size={18} />
                        <span>Export</span>
                    </button>
                    <Link href={"products/new"} className="flex hover:cursor-pointer items-center space-x-2 bg-[#47B083] hover:bg-[#3A9E75] text-white px-4 py-2 rounded-xl transition-colors duration-200">
                        <Plus size={18} />
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{products.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Package className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                {products.filter(p => p.status === 'out-of-stock').length}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <Package className="text-red-600 dark:text-red-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Low Stock</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                {products.filter(p => p.status === 'low-stock').length}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                            <Package className="text-yellow-600 dark:text-yellow-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Featured</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                {products.filter(p => p.featured).length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Star className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 outline-none"
                        />
                    </div>

                    <div className="flex items-center space-x-4">

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 outline-none"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="name">Name A-Z</option>
                            <option value="sales">Best Selling</option>
                        </select>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Filters</span>
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                            >
                                <option value={"all"}>All Categories</option>
                                {categories.map(category => (
                                    
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'all' ? 'All Status' : status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </motion.div>
                )}
            </div>


            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <ProductTable
                    products={sortedProducts}
                    selectedProducts={selectedProducts}
                    onSelectProduct={toggleProductSelection}
                    onSelectAll={toggleAllSelection}
                    onDelete={deleteProduct}
                />
            </div>


            {/* Loading and Empty State */}
            {loadingProducts ? "Loading ......" : sortedProducts.length === 0 && (
                <NotFoundProduct />
            )}
        </div>

    );
};


