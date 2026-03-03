"use client";
import Image from 'next/image';
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '@/types/product.types';


interface CardProps {
  productData: Product
}

const Card = ({ productData }: CardProps) => {

  


  return (

    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
      <div className=" relative group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-700 ease-out overflow-visible">
        <button className="absolute  active:scale-85 top-4 left-4 z-30 p-2 bg-white hover:cursor-pointer dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ">
          <Heart
            size={20}
            className="text-gray-400 hover:text-red  transition-colors duration-200"
            fill="currentColor"
          />
        </button>

        {/* Product Image Section */}
        <div className="relative h-48 sm:h-56 md:h-64 flex items-center justify-center pt-2 pb-8 overflow-visible"
          onMouseEnter={(e) => {
            const bgImage = e.currentTarget.querySelector('.bg-image') as HTMLImageElement;
            if (bgImage) {
              bgImage.style.filter = 'blur(12px) drop-shadow(0 15px 35px rgba(0,0,0,0.25))';
            }
          }}
          onMouseLeave={(e) => {
            const bgImage = e.currentTarget.querySelector('.bg-image') as HTMLImageElement;
            if (bgImage) {
              bgImage.style.filter = 'drop-shadow(0 15px 35px rgba(0,0,0,0.25))';
            }
          }}


        >
          <div className="relative">
            {/* Background Image */}
            <Image
              width={100}
              height={100}
              src={productData.featuredImage.url}
              alt="Premium Sneaker with Background"
              className="bg-image w-74 h-54 sm:w-80 sm:h-56 md:w-96 md:h-64 object-contain transform transition-all duration-700 ease-out
                  relative z-10
                  hover:scale-75 hover:opacity-40 dark:hover:opacity-20"
              style={{
                transformOrigin: 'center bottom',
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.25))',
                transition: 'all 0.7s ease-out'
              }}
            />

            {/* Foreground Image */}
            <Image
              width={100}
              height={100}
              src={productData.featuredImage.url}
              alt="Premium Sneaker"
              className="absolute inset-0 w-74 h-54 sm:w-80 sm:h-56 md:w-96 md:h-64 object-contain transform transition-all duration-700 ease-out
                  opacity-0 scale-90 translate-y-4 rotate-1 z-20
                  hover:opacity-100 hover:scale-115 hover:-translate-y-24 hover:rotate-2
                  filter drop-shadow-lg hover:drop-shadow-2xl"
              style={{
                transformOrigin: 'center bottom',
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.25))'
              }}
            />

            {/* Glow Effect */}
            <div className="absolute inset-0 w-56 h-40 sm:w-64 sm:h-44 md:w-72 md:h-48 bg-gradient-to-b from-transparent via-transparent to-black dark:to-white opacity-15 dark:opacity-10
                      rounded-full blur-xl transform transition-all duration-700 ease-out
                      hover:scale-80 hover:opacity-25 dark:hover:opacity-15 z-5"></div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="px-6 pb-6 transform transition-all duration-700 ease-out ">

          {/* Title */}
          <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1 
                     transition-all duration-300 group-hover:text-[#47b083] ">
              {
                productData.name || " Jordan Retro High"
              }
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-5 leading-relaxed">
            {
              productData.description || "There are no description !!"
            }
          </p>

          {/* Price & Rating */}
          <div className="flex md:items-center justify-between md:flex-row flex-col mb-5">
            <div className="flex items-center space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white 
                         transition-all duration-300 group-hover:text-[#47b083] ">
                ${productData.price}
              </span>
              <span className="text-sm text-[#47b083] dark:text-[#47b083] line-through">${productData.originalPrice}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" className="w-4 h-4" />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">(4.8)</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 sm:py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base
                       transition-all duration-300 dark:hover:bg-[#47b083] transform hover:cursor-pointer active:scale-95 
                    hover:bg-[#47b083] hover:shadow-lg dark:hover:shadow-gray-900/50">
            Add to Cart
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 
                  dark:from-blue-900/30 dark:to-purple-900/30 rounded-full opacity-50 dark:opacity-30 transform transition-all duration-700 ease-out
                  hover:scale-150 hover:opacity-30 dark:hover:opacity-20 hover:rotate-45 z-0"></div>

        <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-yellow-100 to-orange-100 
                  dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full opacity-40 dark:opacity-25 transform transition-all duration-700 ease-out
                  hover:scale-125 hover:opacity-20 dark:hover:opacity-15 hover:-rotate-45 z-0"></div>
      </div>
    </div>

  )

};

export default Card;