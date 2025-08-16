import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";

const ProductDetail = ({ className, ...props }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productData, relatedData] = await Promise.all([
        productService.getById(id),
        productService.getRelated(id, 4)
      ]);
      
      setProduct(productData);
      setRelatedProducts(relatedData);
      
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const success = await addToCart(product.Id, quantity, selectedSize);
    if (success) {
      toast.success("Added to cart successfully!");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return <Error error="Product not found" />;
  }

  const tabs = [
    { id: "description", label: "Description", icon: "FileText" },
    { id: "specifications", label: "Specifications", icon: "Settings" },
    { id: "care", label: "Care Instructions", icon: "Heart" },
    { id: "shipping", label: "Shipping & Returns", icon: "Truck" }
  ];

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)} {...props}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <button onClick={() => navigate("/")} className="hover:text-gold-600">
          Home
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <button 
          onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
          className="hover:text-gold-600"
        >
          {product.category}
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div 
            className={cn(
              "relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in",
              isZoomed && "cursor-zoom-out"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={product.images?.[selectedImageIndex]}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isZoomed && "scale-150"
                )}
              />
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge variant="primary">New</Badge>
              )}
              {product.discount > 0 && (
                <Badge variant="error">-{product.discount}%</Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="warning">Low Stock</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="error">Out of Stock</Badge>
              )}
            </div>

            {/* Zoom Indicator */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              <ApperIcon name="ZoomIn" size={14} className="inline mr-1" />
              Click to zoom
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  selectedImageIndex === index
                    ? "border-gold-500 shadow-md"
                    : "border-gray-200 hover:border-gold-300"
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{product.category}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    size={16}
                    className={cn(
                      i < Math.floor(product.rating || 4.5)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating || "4.5"} ({product.reviews || "24"} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-green-600 font-medium">
                Save {formatPrice(product.originalPrice - product.price)} ({product.discount}% off)
              </p>
            )}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
            <div>
              <span className="text-sm font-medium text-gray-900 block">Metal:</span>
              <span className="text-sm text-gray-600">{product.metal}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 block">Gemstone:</span>
              <span className="text-sm text-gray-600">{product.gemstone}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 block">Weight:</span>
              <span className="text-sm text-gray-600">{product.weight}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 block">In Stock:</span>
              <span className="text-sm text-gray-600">{product.stock} pieces</span>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Size: {selectedSize}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-4 py-2 border rounded-lg text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-gold-500 bg-gold-50 text-gold-700"
                        : "border-gray-300 text-gray-700 hover:border-gold-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 p-0"
              >
                <ApperIcon name="Minus" size={16} />
              </Button>
              
              <span className="w-12 text-center text-lg font-medium">
                {quantity}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className="w-10 h-10 p-0"
              >
                <ApperIcon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
            >
              <ApperIcon name="Heart" size={16} className="mr-2" />
              Add to Wishlist
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm">
              <ApperIcon name="Shield" size={16} className="text-gold-600" />
              <span className="text-gray-600">Lifetime Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ApperIcon name="Truck" size={16} className="text-gold-600" />
              <span className="text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ApperIcon name="RefreshCw" size={16} className="text-gold-600" />
              <span className="text-gray-600">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-gold-500 text-gold-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "description" && (
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Design Philosophy</h4>
                    <p className="text-gray-600">
                      Each piece in our collection represents the perfect balance between traditional craftsmanship and contemporary design. This {product.name.toLowerCase()} embodies our commitment to creating jewelry that transcends trends and becomes a timeless part of your collection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Craftsmanship</h4>
                    <p className="text-gray-600">
                      Handcrafted by our master artisans using time-honored techniques passed down through generations. Every detail is meticulously executed to ensure exceptional quality and lasting beauty.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Product Details</h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="text-gray-900">{product.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Metal Type:</dt>
                      <dd className="text-gray-900">{product.metal}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Gemstone:</dt>
                      <dd className="text-gray-900">{product.gemstone}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight:</dt>
                      <dd className="text-gray-900">{product.weight}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Sizes:</dt>
                      <dd className="text-gray-900">{product.sizes?.join(", ") || "One Size"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Materials & Quality</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      Premium {product.metal} construction
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      Ethically sourced {product.gemstone.toLowerCase()} stones
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      Professional quality finish
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      Hypoallergenic and nickel-free
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Caring for Your Jewelry</h4>
                  <p className="text-gray-600 mb-4">
                    Proper care will ensure your jewelry maintains its beauty and value for generations to come.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <ApperIcon name="Heart" size={16} className="text-gold-600" />
                      Daily Care
                    </h5>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Remove jewelry before showering, swimming, or exercising</li>
                      <li>• Apply lotions, perfumes, and cosmetics before putting on jewelry</li>
                      <li>• Store in a dry, clean place away from direct sunlight</li>
                      <li>• Keep pieces separated to prevent scratching</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <ApperIcon name="Droplets" size={16} className="text-gold-600" />
                      Cleaning Instructions
                    </h5>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Use a soft, lint-free cloth for regular cleaning</li>
                      <li>• For deeper cleaning, use warm soapy water and a soft brush</li>
                      <li>• Rinse thoroughly and dry completely</li>
                      <li>• Professional cleaning recommended annually</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ApperIcon name="Truck" size={16} className="text-gold-600" />
                    Shipping Information
                  </h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Free Standard Shipping</strong> on orders over $500
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Express Shipping</strong> available for urgent orders
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Insured & Tracked</strong> delivery for all orders
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Signature Required</strong> for orders over $1,000
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ApperIcon name="RefreshCw" size={16} className="text-gold-600" />
                    Returns & Exchanges
                  </h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>30-Day Return Policy</strong> for unworn items
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Free Returns</strong> with prepaid shipping label
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Size Exchanges</strong> available within 60 days
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Lifetime Warranty</strong> against manufacturing defects
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  product={relatedProduct}
                  onAddToCart={(product) => addToCart(product.Id)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;