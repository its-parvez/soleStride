"use client";
import { useEffect, useState } from "react";

import {
  Upload,
  Camera,
  X,
  Plus,
  Tag,
  Package,
  Palette,
  Ruler,
  DollarSign,
  Percent,
  FileText,
  ArrowLeft,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import SafeMotion from "@/wrappers/SafeMotion";
import { useToasts } from "@/hooks/useToasts";
import slugify from "slugify";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";


const shoeSizes = [
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
];

const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#DC2626" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Yellow", value: "#CA8A04" },
  { name: "Purple", value: "#9333EA" },
  { name: "Pink", value: "#DB2777" },
  { name: "Gray", value: "#6B7280" },
  { name: "Brown", value: "#92400E" },
];

export default function AddProductPage() {
  const initialValue: ProductFormData = {
    name: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    originalPrice: 0,
    taxRate: 0,
    sku: "",
    stock: 0,
    lowStockThreshold: 5,
    inStock: true,
    trackQuantity: true,
    sizes: [],
    colors: [],
    images: [],
    featuredImage: {
      id: "",
      url: "",
    },
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    seoTitle: "",
    seoDescription: "",
    slug: "",
    tags: [],
    featured: false,
    status: "draft",

  }

 
  const [formData, setFormData] = useState<ProductFormData>(initialValue);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newTag, setNewTag] = useState("");
  const [allImgClear, setAllImgClear] = useState<boolean>(false);
  const [deletingImg, setDeletingImg] = useState<{
    featureLoading: boolean;
    galleryLoading: { [key: string]: boolean };
  }>({
    featureLoading: false,
    galleryLoading: {},
  });
  const [uploadingImg, setUploadingImg] = useState({
    featureLoading: false,
    galleryLoading: false,
  });

  const [dragOver, setDragOver] = useState(false);
  const { successToast, errorToast, infoToast, warningToast } = useToasts();
  const [dataInserting, setDatainserting] = useState<boolean>(false);




  const { data: categories = [] , isLoading : categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  })

  const { data: brands = [] , isLoading : brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/brands")
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  })








  const steps = [
    { number: 1, title: "Basic Info", icon: <FileText size={16} /> },
    { number: 2, title: "Pricing", icon: <DollarSign size={16} /> },
    { number: 3, title: "Inventory", icon: <Package size={16} /> },
    { number: 4, title: "Media", icon: <Camera size={16} /> },
    { number: 5, title: "Variants", icon: <Palette size={16} /> },
    { number: 6, title: "Shipping", icon: <Ruler size={16} /> },
    { number: 7, title: "SEO", icon: <Tag size={16} /> },
    { number: 8, title: "preview", icon: <Eye size={16} /> },
  ];


  useEffect(() => {
    const productDetails = localStorage.getItem("productDetails");
    const step = localStorage.getItem("currentStep");
    if (productDetails) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(productDetails) }));
    }
    if (step) {
      setCurrentStep(parseInt(step || "1", 10));
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("productDetails", JSON.stringify(formData))
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData])



  type InputEvent =
    React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLSelectElement>;

  const handleInputChange = (field: string, e: InputEvent) => {
    let value: string | number | boolean = e.target.value;

    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
      value = value === "" ? "" : Number(value);
    }

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      value = e.target.checked;
    }
    if (field === "name" && typeof value === "string" && value.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: slugify(value, { lower: true, strict: true }),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 4 && !formData.featuredImage.url) {
      warningToast("Featured image required !", "Please upload featured image.")
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep((prev) => Math.min(steps.length, prev + 1));
      localStorage.setItem("currentStep", JSON.stringify(currentStep + 1));
      return;
    }
    setDatainserting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data) {
        successToast("Product uploaded successfully !", "check your product in all products page")
        localStorage.removeItem("productDetails");
        localStorage.removeItem("currentStep")
        setFormData(initialValue)

        setCurrentStep(1)
      }
    } catch {
      errorToast("check product all required fields", "something wrong try again !")
    } finally {
      setDatainserting(false);
    }
  };

  const handleNestedChange = <
    T extends keyof ProductFormData,
    K extends keyof ProductFormData[T]
  >(
    parent: T,
    field: K,
    value: ProductFormData[T][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [field]: value,
      },
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const validateImageFile = (file: File): string | null => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, WebP, GIF)";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }

    return null;
  };

  const handleFeaturedImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateImageFile(file);

    if (error) {
      errorToast(`${error}`);
      return;
    }

    setUploadingImg({
      featureLoading: true,
      galleryLoading: false,
    });
    try {
      const dataFrom = new FormData();
      dataFrom.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: dataFrom,
      });
      const data = await res.json();
      if (data.public_id || data.url) {
        setFormData((prev) => ({
          ...prev,
          featuredImage: {
            id: data.public_id,
            url: data.url,
          },
        }));

        successToast("sucessfully uploaded !", "uploaded feature image");
      }
    } catch (error) {
      console.error("Error uploading featured image:", error);
    } finally {
      setUploadingImg({
        featureLoading: false,
        galleryLoading: false,
      });
    }
  };

  const removeFeaturedImage = async (id: string) => {
    setDeletingImg({
      featureLoading: true,
      galleryLoading: {},
    });
    try {
      const res = await fetch("/api/delete-image", {
        method: "DELETE",
        body: JSON.stringify({ public_id: id }),
      });
      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          featuredImage: {
            id: "",
            url: "",
          },
        }));

        successToast("sucessfully deleted !", "deleted featured image");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingImg({
        featureLoading: false,
        galleryLoading: {},
      });
    }
  };

  const handleGalleryImagesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (formData.images.length === 4) {
      infoToast(
        "Can't uploaded more images!",
        "you can upload only four images"
      );
      return;
    }

    const file = files[0];
    const error = validateImageFile(file);

    if (error) {
      errorToast(`${error}`);
      return;
    }

    setUploadingImg({
      featureLoading: false,
      galleryLoading: true,
    });
    try {
      const dataFrom = new FormData();
      dataFrom.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: dataFrom,
      });
      const data = await res.json();
      if (data.public_id || data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { id: data.public_id, url: data.url }],
        }));
        successToast("sucessfully uploaded !", "uploaded feature image");
      }
    } catch (error) {
      errorToast(`${error}`);
    } finally {
      setUploadingImg({
        featureLoading: false,
        galleryLoading: false,
      });
    }
  };

  const removeGalleryImage = async (id: string) => {
    setDeletingImg({ featureLoading: false, galleryLoading: { [id]: true } });

    try {
      const res = await fetch("/api/delete-image", {
        method: "DELETE",
        body: JSON.stringify({ public_id: id }),
      });
      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img.id !== id),
        }));

        successToast("sucessfully deleted !", "deleted featured image");
      }
    } catch (error) {
      errorToast(`${error}`);
    } finally {
      setDeletingImg({
        featureLoading: false,
        galleryLoading: { [id]: false },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: "featured" | "gallery") => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (type === "featured") {
      handleFeaturedImageUpload(files);
    } else {
      handleGalleryImagesUpload(files);
    }
  };

  const triggerFileInput = (inputId: string) => {
    if (uploadingImg.featureLoading || uploadingImg.galleryLoading) return;
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleAllGalleryDlt = async () => {
    const ids = formData.images.map((i) => i.id);
    setAllImgClear(true);
    try {
      const res = await fetch("/api/delete-images", {
        method: "POST",
        body: JSON.stringify({ public_ids: ids }),
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, images: [] }));
        successToast("sucessfully deleted !", "deleted all gallery images");
      }
    } catch (error) {
      errorToast(`${error}`);
    } finally {
      setAllImgClear(false);
    }
  };




  if(categoriesLoading || brandsLoading ) return <p>Loading...</p>

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={'/admin/products'} className="p-2 hover:cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create a new product for your store
            </p>
          </div>
        </div>


      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl py-3 px-2 shadow-lg h-fit">
        <div className="flex flex-row gap-3 itemc-center overflow-x-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className=" flex flex-row justify-between w-full gap- items-center "
            >
              <div
                className={`flex items-center space-x-2 w-full py-2 px-3  rounded-xl transition-all duration-200 ${currentStep === step.number
                  ? "bg-[#47B083] text-white shadow-lg"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                <div
                  className={`p-2 rounded-lg ${currentStep === step.number
                    ? "bg-white/20"
                    : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                  {step.icon}
                </div>
                <span className="font-medium whitespace-nowrap">
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        id="product-form"
        name="product-form"
        onSubmit={handleSubmit}
        className="space-y-6 flex-1"
      >
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e)}
                    className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="e.g., Nike Air Max 270"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e)
                    }
                    className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors duration-200"
                    placeholder="Describe your product in detail..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e)
                      }
                      className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category: Category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand *
                    </label>
                    <select
                      required
                      value={formData.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e)
                      }
                      className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand: Brand, index: number) => (
                        <option key={index} value={brand.name}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Status
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        handleInputChange("featured", e)
                      }
                      className="rounded border-gray-300 text-[#47B083] focus:ring-[#47B083]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Feature this product
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e)
                      }
                      className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className="flex-1 outline-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-[#47B083] text-white rounded-lg hover:bg-[#3A9E75] transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:cursor-pointer hover:text-red-500 transition-colors duration-200"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SafeMotion>
        )}

        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Pricing Information
            </h2>

            <div className="flex flex-row justify-between flex-wrap gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selling Price *
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        e
                      )
                    }
                    className="w-full outline-none pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Price
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      handleInputChange(
                        "originalPrice",
                        e
                      )
                    }
                    className="w-full outline-none pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <div className="relative">
                  <Percent
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    max={100}
                    min={0}
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) =>
                      handleInputChange(
                        "taxRate",
                        e
                      )
                    }
                    className="w-full pl-10 pr-4 outline-none py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {formData.originalPrice > formData.price && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 dark:text-green-300 font-medium">
                    Discount
                  </span>
                  <span className="text-green-800 dark:text-green-300 font-bold">
                    {(
                      ((formData.originalPrice - formData.price) /
                        formData.originalPrice) *
                      100
                    ).toFixed(1)}
                    % OFF
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-800 dark:text-green-300">
                    You save
                  </span>
                  <span className="text-green-800 dark:text-green-300 font-bold">
                    ${(formData.originalPrice - formData.price).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </SafeMotion>
        )}

        {/* Step 3: Inventory */}
        {currentStep === 3 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Inventory Management
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU (Stock Keeping Unit)*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e)}
                    className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="e.g., NIKE-AM270-BLK"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange(
                          "stock",
                          e
                        )
                      }
                      className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.lowStockThreshold}
                      onChange={(e) =>
                        handleInputChange(
                          "lowStockThreshold",
                          e)
                      }
                      className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.trackQuantity}
                      onChange={(e) =>
                        handleInputChange("trackQuantity", e)
                      }
                      className="rounded border-gray-300 text-[#47B083] focus:ring-[#47B083]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Track quantity
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) =>
                        handleInputChange("inStock", e)
                      }
                      className="rounded border-gray-300 text-[#47B083] focus:ring-[#47B083]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      In stock
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Stock Status
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      Current Stock
                    </span>
                    <span
                      className={`font-bold ${formData.stock === 0
                        ? "text-red-600 dark:text-red-400"
                        : formData.stock <= formData.lowStockThreshold
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                        }`}
                    >
                      {formData.stock} units
                    </span>
                  </div>

                  {formData.stock > 0 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${formData.stock <= formData.lowStockThreshold
                          ? "bg-yellow-500"
                          : "bg-green-500"
                          }`}
                        style={{
                          width: `${Math.min(
                            (formData.stock / 100) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {formData.stock <= formData.lowStockThreshold &&
                  formData.stock > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-300">
                        <span className="font-medium">Low Stock Alert</span>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                        Stock is running low. Consider reordering soon.
                      </p>
                    </div>
                  )}

                {formData.stock === 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-center space-x-2 text-red-800 dark:text-red-300">
                      <span className="font-medium">Out of Stock</span>
                    </div>
                    <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                      This product is currently out of stock.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SafeMotion>
        )}

        {/* Step 4: Media Upload*/}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Hidden file inputs */}
            <input
              id="featured-image-input"
              name="featured-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => handleFeaturedImageUpload(e.target.files)}
              className="hidden"
            />
            <input
              id="gallery-images-input"
              name="gallery-images-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleGalleryImagesUpload(e.target.files)}
              className="hidden"
            />

            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Featured Image *
              </h2>

              {formData.featuredImage.url ? (
                <div className="relative max-w-md mx-auto">
                  <div className="border-2 border-green-500 rounded-2xl overflow-hidden h-64 w-full relative">
                    <Image
                      src={formData.featuredImage.url}
                      alt="Featured"
                      fill
                      unoptimized
                      className=" absolute object-cover"
                    />
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      type="button"
                      disabled={deletingImg.featureLoading}
                      onClick={() =>
                        removeFeaturedImage(formData.featuredImage.id)
                      }
                      className="bg-red-500 text-white p-2 rounded-lg disabled:cursor-not-allowed hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
                      title="Remove image"
                    >
                      {deletingImg.featureLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-200 cursor-pointer ${dragOver
                    ? "border-[#47B083] bg-[#47B083]/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-[#47B083]"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "featured")}
                  onClick={() => triggerFileInput("featured-image-input")}
                >
                  <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop your featured image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Recommended: 800x800px, JPG, PNG or WebP format (Max 5MB)
                  </p>
                  <button
                    type="button"
                    disabled={uploadingImg.featureLoading}
                    className="bg-[#47B083] flex justify-center mx-auto items-center space-x-2 hover:cursor-pointer hover:bg-[#3A9E75] text-white px-6 py-2 rounded-xl transition-colors duration-200"
                  >
                    {uploadingImg.featureLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>uploading ...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="inline mr-2" size={18} />
                        Upload Featured Image
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gallery Images
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.images.length} images
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Add Image Card */}
                <div
                  className={`border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer ${dragOver
                    ? "border-[#47B083] bg-[#47B083]/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-[#47B083]"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "gallery")}
                  aria-disabled={uploadingImg.galleryLoading}
                  onClick={() => triggerFileInput("gallery-images-input")}
                >
                  {uploadingImg.galleryLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
                      <span>uploading .....</span>
                    </>
                  ) : (
                    <>
                      <Plus className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Add Images
                      </span>
                    </>
                  )}
                </div>

                {/* Gallery Images */}
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 dark:border-gray-700 rounded-xl aspect-square bg-gray-100 dark:bg-gray-700 grou overflow-hidden"
                  >
                    <div className="relative h-full w-full ">
                      <Image
                        src={image.url}
                        alt={image.id}
                        unoptimized
                        fill
                        className="object-cover absolute"
                      />

                    </div>

                    {/* Image Overlay Actions */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        type="button"
                        disabled={deletingImg.galleryLoading[image.id]}
                        onClick={() => removeGalleryImage(image.id)}
                        className="bg-red-500 text-white p-2 rounded-lg disabled:cursor-not-allowed hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
                        title="Remove image"
                      >
                        {deletingImg.galleryLoading[image.id] ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X size={16} />
                        )}
                      </button>
                    </div>

                    {/* Image Info Badge */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black bg-opacity-70 text-white text-xs p-1 rounded text-center truncate">
                        {image.url}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulk Actions */}
              {formData.images.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Select multiple images to manage in bulk
                  </div>
                  <button
                    type="button"
                    onClick={handleAllGalleryDlt}
                    disabled={allImgClear}
                    className="text-red-600 hover:cursor-pointer dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
                  >
                    {allImgClear ? "clearing ...." : "Clear All Gallery Images"}
                  </button>
                </div>
              )}
            </div>

            {/* Image Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                Image Guidelines
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>
                  • Use high-quality, professional product photos (min
                  800x800px)
                </li>
                <li>
                  • Show product from multiple angles (front, back, sides, top,
                  bottom)
                </li>
                <li>• Include lifestyle images showing the product in use</li>
                <li>• Use natural lighting when possible</li>
                <li>• Maintain consistent background across all images</li>
                <li>• Maximum file size: 5MB per image</li>
                <li>• Supported formats: JPEG, PNG, WebP, GIF</li>
                <li>• Gallery images: only can upload four photos</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Step 5: Variants */}
        {currentStep === 5 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex md:flex-row flex-col gap-5"
          >
            {/* Sizes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex-1 ">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sizes *
              </h3>

              <div className="space-y-4">
                <select
                  onChange={(e) => {
                    const value = e?.target?.value;
                    if (
                      !formData.sizes.includes(value) && value
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        sizes: [...prev.sizes, value],
                      }));
                    }
                  }}
                  required={formData.sizes.length === 0}
                  className=" w-full outline-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Size</option>
                  {shoeSizes.filter((size) => !formData.sizes.includes(size)).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 ">
                  {formData.sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {size}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            sizes: prev.sizes.filter((s) => s !== size),
                          }))
                        }
                        className="text-gray-500 hover:text-red-500 transition-colors duration-200 hover:cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* colors*/}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Colors *
                    </h3>

                    <select

                      onChange={(e) => {
                        const value = e?.target?.value;
                        if (
                          !formData.colors.includes(value) &&
                          value
                        ) {
                          setFormData((pre) => ({
                            ...pre,
                            colors: [...pre.colors, value],
                          }));
                        }
                      }}
                      required={formData.colors.length === 0}
                      className="w-full px-3 outline-none py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value={""}>Select color</option>
                      {colors.filter((color) => !formData.colors.includes(color.name)).map((color, index) => (
                        <option defaultValue={color?.name} key={index} value={color.name}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
                      >
                        <div
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{
                            backgroundColor:
                              colors.find((c) => c.name === color)?.value ||
                              "#ccc",
                          }}
                        ></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {color}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              colors: prev.colors.filter((c) => c !== color),
                            }))
                          }
                          className="text-gray-500 hover:text-red-500 transition-colors duration-200 hover:cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Variant Combinations Preview */}
            <div className=" bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Variant Combinations
              </h3>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div
                  className={` ${formData.sizes.length > 0 &&
                    formData.colors.length > 0 &&
                    "grid"
                    } grid-cols-1 md:grid-cols-2 gap-4 `}
                >
                  {formData.sizes.length > 0 && formData.colors.length > 0 ? (
                    formData.sizes.flatMap((size) =>
                      formData.colors.map((color) => (
                        <div
                          key={`${size}-${color}`}
                          className="flex flex-col gap-3 items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{
                                backgroundColor:
                                  colors.find((c) => c.name === color)?.value ||
                                  "#ccc",
                              }}
                            ></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {color} - {size}
                            </span>
                          </div>
                          <div className="flex items-center justify-center  flex-col gap-2">
                            <input
                              type="number"
                              min={0}
                              placeholder="Qty"
                              className="w-20 px-2 py-1 outline-none border border-gray-300 dark:border-gray-500 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <input
                              type="number"
                              min={0}
                              placeholder="Price"
                              className="w-20 px-2 py-1 outline-none border border-gray-300 dark:border-gray-500 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-sm ">
                      Add sizes and colors to see variant combinations
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SafeMotion>
        )}

        {/* Step 6: Shipping */}
        {currentStep === 6 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row gap-4 "
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex-1 ">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Shipping Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange(
                          "weight",
                          e
                        )
                      }
                      className="w-full outline-none pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      kg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Length
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={formData.dimensions.length}
                        onChange={(e) =>
                          handleNestedChange(
                            "dimensions",
                            "length",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full outline-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={formData.dimensions.width}
                        onChange={(e) =>
                          handleNestedChange(
                            "dimensions",
                            "width",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full outline-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={formData.dimensions.height}
                        onChange={(e) =>
                          handleNestedChange(
                            "dimensions",
                            "height",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full outline-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shipping Class
                  </label>
                  <select className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Standard Shipping</option>
                    <option>Express Shipping</option>
                    <option>Oversized Item</option>
                    <option>Free Shipping</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-1 hyphens-auto">
              {/* Shipping Calculator Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Shipping Preview
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Weight:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Dimensions:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.dimensions.length} × {formData.dimensions.width}{" "}
                      × {formData.dimensions.height} cm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SafeMotion>
        )}

        {/* Step 7: SEO */}
        {currentStep === 7 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Search Engine Optimization
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Title *
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    required
                    value={formData.seoTitle}
                    onChange={(e) =>
                      handleInputChange("seoTitle", e)
                    }
                    className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Optimized title for search engines (50-60 characters)"
                    maxLength={60}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Recommended: 50-60 characters
                    </span>
                    <span
                      className={`text-xs ${formData.seoTitle.length > 60
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {formData.seoTitle.length}/60
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.seoDescription}
                    onChange={(e) =>
                      handleInputChange("seoDescription", e)
                    }
                    className="w-full outline-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#47B083] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors duration-200"
                    placeholder="Compelling description for search results (150-160 characters)"
                    maxLength={160}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Recommended: 150-160 characters
                    </span>
                    <span
                      className={`text-xs ${formData.seoDescription.length > 160
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {formData.seoDescription.length}/160
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* SEO Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search Result Preview
                </h3>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="text-blue-600 dark:text-blue-400 text-lg font-medium line-clamp-1">
                      {formData.seoTitle || "Your SEO Title Will Appear Here"}
                    </div>
                    <div className="text-green-600 dark:text-green-400 text-sm wrap-anywhere">
                      https://solestride.com/products/
                      {formData.slug || "your-product-slug"}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {formData.seoDescription ||
                        "Your SEO description will appear here in search results. Make it compelling to attract clicks!"}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Recommendations */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  SEO Recommendations
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Include primary keywords in the title and description
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Write compelling, action-oriented descriptions
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Use hyphens in URLs for better readability
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Keep URLs short and descriptive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SafeMotion>
        )}

        {/* Step 8: Product Preview */}
        {currentStep === 8 && (
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Preview Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="md:text-2xl text-md font-bold text-gray-900 dark:text-white">
                    Product Preview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Review all product details before publishing
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${formData.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : formData.status === "draft"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                      }`}
                  >
                    {formData.status.charAt(0).toUpperCase() +
                      formData.status.slice(1)}
                  </span>
                  {formData.featured && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 space-y-6">
                {/* Product Images Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  {/* Featured Image */}
                  <div className="relative">
                    {formData.featuredImage.url ? (
                      <div className="relative md:h-80 h-64">
                        <Image
                          src={formData.featuredImage.url}
                          alt="Featured"
                          fill
                          unoptimized
                          className="absolute object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Camera className="text-gray-400" size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured Image
                      </span>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  {formData.images.length > 0 && (
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Gallery Images ({formData.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-full h-full aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                          >
                            <Image
                              fill
                              unoptimized
                              src={image.url}
                              alt={`Gallery ${index + 1}`}
                              className="object-cover absolute"
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Product Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Product Name
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {formData.name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Description
                      </label>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {formData.description || "No description provided"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Category
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {formData.category || "Not selected"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Brand
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {formData.brand || "Not selected"}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {formData.tags.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Variants Preview */}
                {(formData.sizes.length > 0 || formData.colors.length > 0) && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Product Variants
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sizes */}
                      {formData.sizes.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Available Sizes
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formData.sizes.map((size, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Colors */}
                      {formData.colors.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Available Colors
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formData.colors.map((color, index) => {
                              const colorInfo = colors.find(
                                (c) => c.name === color
                              );
                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                >
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{
                                      backgroundColor:
                                        colorInfo?.value || "#ccc",
                                    }}
                                  ></div>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {color}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>


              <div className="space-y-6">
                {/* Pricing & Inventory Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Pricing & Inventory
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Selling Price
                      </span>
                      <span className="text-2xl font-bold text-[#47B083]">
                        ${formData.price.toFixed(2)}
                      </span>
                    </div>

                    {formData.originalPrice > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Original Price
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                          ${formData.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {formData.originalPrice > formData.price && (
                      <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <span className="text-green-700 dark:text-green-300">
                          Discount
                        </span>
                        <span className="text-green-700 dark:text-green-300 font-bold">
                          {(
                            ((formData.originalPrice - formData.price) /
                              formData.originalPrice) *
                            100
                          ).toFixed(1)}
                          % OFF
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Stock Quantity
                        </span>
                        <span
                          className={`font-semibold ${formData.stock === 0
                            ? "text-red-600 dark:text-red-400"
                            : formData.stock <= formData.lowStockThreshold
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                            }`}
                        >
                          {formData.stock} units
                        </span>
                      </div>

                      {formData.stock > 0 && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${formData.stock <= formData.lowStockThreshold
                              ? "bg-yellow-500"
                              : "bg-green-500"
                              }`}
                            style={{
                              width: `${Math.min(
                                (formData.stock / 100) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        SKU
                      </span>
                      <span className="text-gray-900 dark:text-white font-mono">
                        {formData.sku || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Shipping Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Weight
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.weight} kg
                      </span>
                    </div>

                    {(formData.dimensions.length > 0 ||
                      formData.dimensions.width > 0 ||
                      formData.dimensions.height > 0) && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Dimensions
                          </span>
                          <div className="text-gray-900 dark:text-white text-sm mt-1">
                            {formData.dimensions.length} ×{" "}
                            {formData.dimensions.width} ×{" "}
                            {formData.dimensions.height} cm
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    SEO Preview
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        SEO Title
                      </label>
                      <p className="text-gray-900 dark:text-white text-sm line-clamp-2">
                        {formData.seoTitle || "No SEO title set"}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.seoTitle.length}/60 characters
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        SEO Description
                      </label>
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                        {formData.seoDescription || "No SEO description set"}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.seoDescription.length}/160 characters
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        URL Slug
                      </label>
                      <div className="text-blue-600 dark:text-blue-400 text-sm font-mono text-wrap wrap-anywhere">
                        solestride.com/products/
                        {formData.slug || "your-product-slug"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Status */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Validation Status
                  </h3>

                  <div className="space-y-3">
                    {[
                      { condition: !!formData.name, label: "Product name" },
                      {
                        condition: !!formData.description,
                        label: "Product description",
                      },
                      {
                        condition: !!formData.category,
                        label: "Product category",
                      },
                      { condition: !!formData.brand, label: "Product brand" },
                      { condition: formData.price > 0, label: "Selling price" },
                      {
                        condition: !!formData.featuredImage.url,
                        label: "Featured image",
                      },
                      {
                        condition: formData.images.length > 0,
                        label: "Gallery images",
                      },
                      {
                        condition: formData.stock >= 0,
                        label: "Stock quantity",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {item.condition ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                        <span
                          className={`text-sm ${item.condition
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-red-600 dark:text-red-400"
                            }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Completion Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Completion
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {
                          [
                            !!formData.name,
                            !!formData.description,
                            !!formData.category,
                            !!formData.brand,
                            formData.price > 0,
                            !!formData.featuredImage.url,
                            formData.images.length > 0,
                            formData.stock >= 0,
                          ].filter(Boolean).length
                        }
                        /8
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#47B083] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${([
                            !!formData.name,
                            !!formData.description,
                            !!formData.category,
                            !!formData.brand,
                            formData.price > 0,
                            !!formData.featuredImage.url,
                            formData.images.length > 0,
                            formData.stock >= 0,
                          ].filter(Boolean).length /
                            8) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Fields Warning */}
            {!formData.name ||
              !formData.description ||
              !formData.category ||
              !formData.brand ||
              formData.price <= 0 ||
              !formData.featuredImage.url ||
              formData.images.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle
                    className="text-yellow-600 dark:text-yellow-400 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Required Fields Missing
                    </h4>
                    <ul className="text-yellow-700 dark:text-yellow-400 text-sm space-y-1">
                      {!formData.name && <li>• Product name is required</li>}
                      {!formData.description && (
                        <li>• Product description is required</li>
                      )}
                      {!formData.category && (
                        <li>• Product category is required</li>
                      )}
                      {!formData.brand && <li>• Product brand is required</li>}
                      {formData.price <= 0 && (
                        <li>• Selling price must be greater than 0</li>
                      )}
                      {!formData.featuredImage.url && (
                        <li>• Featured image is required</li>
                      )}
                      {formData.images.length === 0 && (
                        <li>• At least one gallery image is required</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-300">
                      All Required Fields Completed
                    </h4>
                    <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                      Your product is ready to be published!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SafeMotion>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setCurrentStep((prev) => Math.max(1, prev - 1));
              localStorage.setItem(
                "currentStep",
                JSON.stringify(currentStep - 1)
              );
            }}
            className="px-6 py-3 hover:cursor-pointer border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            disabled={currentStep === 1}
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="submit"
              className="px-6 hover:cursor-pointer py-3 bg-[#47B083] hover:bg-[#3A9E75] text-white rounded-xl transition-colors duration-200"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 flex flex-row items-center justify-center gap-2 hover:cursor-pointer py-3 bg-[#47B083] hover:bg-[#3A9E75] text-white rounded-xl transition-colors duration-200"
            >
              {
                dataInserting ?
                  <>
                    <div className="w-4 h-4 border-2 border-t-0 rounded-full animate-spin "></div>
                    publishing ....
                  </> : " Publish Product"
              }

            </button>
          )}
        </div>
      </form>
    </div>
  );
}
