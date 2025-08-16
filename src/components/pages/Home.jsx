import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

const Home = ({ className, ...props }) => {
  const navigate = useNavigate();
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts(8);
  const { products: newArrivals, loading: newArrivalsLoading } = useNewArrivals(4);
  const { addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const heroSlides = [
    {
      id: 1,
      title: "Discover Timeless Elegance",
      subtitle: "Exquisite Jewelry Collections",
      description: "Handcrafted pieces that celebrate life's precious moments with unparalleled beauty and craftsmanship.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=600&fit=crop",
      cta: "Explore Collection",
      link: "/category/rings"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Latest in Luxury Jewelry",
      description: "Be the first to discover our newest designs, featuring contemporary styles and classic elegance.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=600&fit=crop",
      cta: "Shop New Arrivals",
      link: "/new-arrivals"
    },
    {
      id: 3,
      title: "Bridal Collection",
      subtitle: "Forever Starts Here",
      description: "Find the perfect symbol of your love with our stunning engagement rings and wedding bands.",
      image: "https://images.unsplash.com/photo-1614715838598-2c90dd5a5f16?w=1200&h=600&fit=crop",
      cta: "Browse Bridal",
      link: "/collections/bridal"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    {
      name: "Engagement Rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      link: "/category/rings/engagement-rings",
      description: "Symbol of eternal love"
    },
    {
      name: "Necklaces",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
      link: "/category/necklaces",
      description: "Elegant statement pieces"
    },
    {
      name: "Earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
      link: "/category/earrings",
      description: "Perfect finishing touch"
    },
    {
      name: "Bracelets",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      link: "/category/bracelets",
      description: "Luxury for every wrist"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely stunning! The quality is exceptional and the customer service was perfect. My engagement ring is everything I dreamed of.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      text: "Bought a necklace for my wife's anniversary. The craftsmanship is incredible and it arrived beautifully packaged. Highly recommend!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      text: "The diamond earrings I purchased are absolutely gorgeous. They sparkle beautifully and the quality is outstanding.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product.Id);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  if (featuredLoading && newArrivalsLoading) {
    return <Loading />;
  }

  return (
    <div className={cn("space-y-16", className)} {...props}>
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl lg:text-2xl font-light mb-2 text-gold-200">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-lg mb-8 text-gray-200 leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate(heroSlides[currentSlide].link)}
                  className="text-lg px-8 py-4"
                >
                  {heroSlides[currentSlide].cta}
                  <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/about")}
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Our Story
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentSlide
                  ? "bg-gold-500 scale-110"
                  : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of fine jewelry, each piece crafted with precision and designed to celebrate life's special moments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={category.link}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display text-xl font-bold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our most beloved pieces, selected for their exceptional beauty and craftsmanship.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/products")}
          >
            View All Products
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Be the first to discover our latest designs, featuring contemporary styles that blend tradition with innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate("/new-arrivals")}
            >
              Shop New Arrivals
              <ApperIcon name="Sparkles" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
              Crafted with Passion, Worn with Pride
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              For over three decades, Luxe Jewels has been creating extraordinary pieces that capture the essence of elegance and sophistication. Each piece in our collection is meticulously handcrafted by master artisans who bring decades of expertise and passion to their work.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From the selection of the finest gemstones to the precision of every setting, we ensure that each piece meets the highest standards of quality and beauty. Our commitment to excellence has made us a trusted name in luxury jewelry.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <ApperIcon name="Award" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                <p className="text-sm text-gray-600">Only the finest materials and gemstones</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <ApperIcon name="Users" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Expert Craftsmanship</h4>
                <p className="text-sm text-gray-600">Master artisans with decades of experience</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <ApperIcon name="Heart" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Lifetime Value</h4>
                <p className="text-sm text-gray-600">Pieces designed to last generations</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                size="lg"
                onClick={() => navigate("/about")}
              >
                Learn More About Us
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/craftsmanship")}
              >
                Our Craftsmanship
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1611652022313-8cedfbe7739a?w=600&h=450&fit=crop"
                alt="Jewelry craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Sparkles" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">30+ Years</p>
                  <p className="text-xs text-gray-600">of Excellence</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Star" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">10,000+</p>
                  <p className="text-xs text-gray-600">Happy Customers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their Luxe Jewels experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <ApperIcon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">Verified Customer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-gold-600 to-gold-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay in Touch
          </h2>
          <p className="text-xl text-gold-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and jewelry care tips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gold-600"
            />
            <Button
              variant="secondary"
              size="lg"
              className="whitespace-nowrap bg-white text-gold-700 hover:bg-gray-50"
            >
              Subscribe Now
            </Button>
          </div>
          
          <p className="text-sm text-gold-200 mt-4">
            No spam, unsubscribe at any time. Read our privacy policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;