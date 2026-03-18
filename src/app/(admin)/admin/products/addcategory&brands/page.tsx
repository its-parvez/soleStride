"use client";

import { useState } from 'react';
import { NextPage } from 'next';
import { Trash2 } from 'lucide-react';
import { useToasts } from '@/hooks/useToasts';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  level: number;
  highlight: boolean;
}

interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
}

const CategoryBrandUpload: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'category' | 'brand'>('category');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { successToast, errorToast } = useToasts();
  const [ishighlight, setIshighlight] = useState<boolean>(false)
  const initialvalueCategory = {
    name: '',
    description: '',
    parentId: '',
  }
  const [categoryForm, setCategoryForm] = useState(initialvalueCategory);

  const initialvalueBrands = {
    name: '',
    description: '',
    logo: '',
    website: ''
  }
  const [brandForm, setBrandForm] = useState(initialvalueBrands);

  const mainCategories = categories.filter(cat => cat.level === 0);

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryForm,
      parentId: categoryForm.parentId || null,
      level: categoryForm.parentId ? 1 : 0,
      highlight: categoryForm.parentId ? false : ishighlight
    };
    setCategories([...categories, newCategory]);
    setCategoryForm(initialvalueCategory);
    setIshighlight(false)

  };

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBrand: Brand = {
      id: Date.now().toString(),
      ...brandForm
    };
    setBrands([...brands, newBrand]);
    setBrandForm(initialvalueBrands);
  };

  const deleteCategory = (id: string) => {
    const categoriesToDelete = [id];
    const subcategories = categories.filter(cat => cat.parentId === id);
    subcategories.forEach(sub => categoriesToDelete.push(sub.id));

    setCategories(categories.filter(cat => !categoriesToDelete.includes(cat.id)));
  };

  const deleteBrand = (id: string) => {
    setBrands(brands.filter(brand => brand.id !== id));
  };




  const handlePublish = async (active: string) => {
    setLoading({ [activeTab]: true })


    try {

      if (active == 'category') {

        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categories)
        })

        const data = await res.json();
        console.log(data)

        if (data) {
          successToast("successfully published categories", "New categories added!");
          setCategoryForm(initialvalueCategory);
          setCategories([])
        }

      }
      else if (active == 'brand') {

        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brands)
        })

        const data = await res.json();
        if (data) {
          successToast("successfully published Brands", "New Brands added!");
          setBrandForm(initialvalueBrands);
          setBrands([])

        }

      }


    }
    catch (error) {

      errorToast(`${error}`, 'something wrong try again !')

    }
    finally {
      setLoading({ [activeTab]: false })

    }

  }

 


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Categories & Brands
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage product categories, subcategories and brands for your shoe store
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between ">

          <div className=" flex space-x-8">
            <button
              onClick={() => setActiveTab('category')}
              className={`py-2 px-1 border-b-2 hover:cursor-pointer font-medium text-sm ${activeTab === 'category'
                ? 'border-[#3A9E75] text-[#3A9E75]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className={`py-2 px-1 border-b-2 hover:cursor-pointer font-medium text-sm ${activeTab === 'brand'
                ? 'border-[#3A9E75] text-[#3A9E75]'
                : 'border-transparent  text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              Brands
            </button>
          </div>



          <button disabled={activeTab === "brand" ? !brands?.length : !categories?.length} onClick={() => handlePublish(activeTab)} className="flex disabled:opacity-85 disabled:cursor-not-allowed justify-center gap-2 hover:cursor-pointer items-center bg-[#47B083] hover:bg-[#3A9E75] text-white px-4 py-2 rounded-xl transition-colors duration-200">
            {
              loading[activeTab] ? <>
                <div className="w-5 h-5 border border-t-0 rounded-full animate-spin"></div>
                publishing ....
              </> : "Publish"
            }
          </button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {activeTab === 'category' ? 'Add New Category' : 'Add New Brand'}
            </h2>

            {activeTab === 'category' ? (
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                {/* Parent Category Selection for Subcategories */}
                {mainCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Parent Category (Optional)
                    </label>
                    <select
                      value={categoryForm.parentId}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Parent Category (for subcategories)</option>
                      {mainCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Leave empty to create a main category
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {categoryForm.parentId ? 'Subcategory Name' : 'Category Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    placeholder={categoryForm.parentId ? "e.g., Running Shoes" : "e.g., Men's Shoes"}
                  />
                </div>
                {
                  !categoryForm.parentId &&
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={ishighlight}
                      onChange={(e) =>
                        setIshighlight(e.target.checked)
                      }
                      className="rounded border-gray-300 text-[#47B083] focus:ring-[#47B083]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Highlight category
                    </span>
                  </label>
                }

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    placeholder={`Describe this ${categoryForm.parentId ? 'subcategory' : 'category'}...`}
                  />
                </div>


                <button
                  type="submit"
                  className="w-full hover:cursor-pointer bg-[#3A9E75]  text-white py-2 px-4 rounded-md hover:bg-[#2d8a62] dark:focus:ring-offset-gray-800 transition-colors"
                >
                  {categoryForm.parentId ? 'Add Subcategory' : 'Add Category'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleBrandSubmit} className="space-y-4">
                {/* Brand form remains the same */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Nike"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    placeholder="Describe this brand..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={brandForm.logo}
                    onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={brandForm.website}
                    onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#3A9E75] focus:border-[#3A9E75] dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3A9E75] text-white py-2 px-4 rounded-md hover:bg-[#2d8a62] hover:cursor-pointer"
                >
                  Add Brand
                </button>
              </form>
            )}
          </div>

          {/* List Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {activeTab === 'category' ? 'Categories & Subcategories' : 'Brands'}
              ({activeTab === 'category' ? categories.length : brands.length})
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeTab === 'category' ? (
                categories.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No categories added yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Main Categories */}
                    {mainCategories.map((category) => (
                      <div key={category.id}>
                        {/* Main Category */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="flex items-center space-x-4">

                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                📁 {category.name} (Main)
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer"
                          >
                            <Trash2 size={22} />
                          </button>

                        </div>

                        {/* Subcategories */}
                        {getSubcategories(category.id).map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg ml-8 mt-2 bg-white dark:bg-gray-800"
                          >
                            <div className="flex items-center space-x-4">

                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  └─ 🏷️ {subcategory.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {subcategory.description}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteCategory(subcategory.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}


                      </div>
                    ))}
                  </div>
                )
              ) : brands.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No brands added yet
                </p>
              ) : (
                brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {brand.logo && (
                        <div className='relative w-12 h-12 '>

                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-cover absolute rounded "
                            unoptimized
                          />

                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {brand.description}
                        </p>
                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#3A9E75] hover:underline"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteBrand(brand.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBrandUpload;