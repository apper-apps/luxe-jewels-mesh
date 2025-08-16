import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Footer = ({ className, ...props }) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Successfully subscribed to our newsletter!");
    setEmail("");
    setIsSubscribing(false);
  };
  
  const footerLinks = {
    "Customer Service": [
      { name: "Contact Us", href: "/contact" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Care Instructions", href: "/care" },
      { name: "Returns & Exchanges", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "FAQ", href: "/faq" }
    ],
    "About Luxe Jewels": [
      { name: "Our Story", href: "/about" },
      { name: "Craftsmanship", href: "/craftsmanship" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Press", href: "/press" },
      { name: "Careers", href: "/careers" },
      { name: "Store Locator", href: "/stores" }
    ],
    "Collections": [
      { name: "Engagement Rings", href: "/category/rings/engagement-rings" },
      { name: "Wedding Bands", href: "/category/rings/wedding-bands" },
      { name: "Diamond Necklaces", href: "/category/necklaces/diamond-necklaces" },
      { name: "Pearl Earrings", href: "/category/earrings/pearl-earrings" },
      { name: "Tennis Bracelets", href: "/category/bracelets/tennis-bracelets" },
      { name: "Gift Sets", href: "/collections/gift-sets" }
    ]
  };
  
  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Pinterest", icon: "Heart", href: "#" },
    { name: "YouTube", icon: "Play", href: "#" }
  ];
  
  return (
    <footer className={cn("bg-gray-900 text-white", className)} {...props}>
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4">
              Stay Updated with Our Latest Collections
            </h3>
            <p className="text-gray-400 mb-8">
              Be the first to know about new arrivals, exclusive offers, and jewelry care tips.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gold-500"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubscribing}
                className="whitespace-nowrap"
              >
                {isSubscribing ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Mail" size={16} className="mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Gem" size={20} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Luxe Jewels
              </span>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Discover exquisite handcrafted jewelry that celebrates life's precious moments. 
              From engagement rings to everyday elegance, each piece is crafted with passion and precision.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ApperIcon name="Phone" size={16} className="text-gold-500" />
                <span className="text-sm">1-800-LUXE-JEWELS</span>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Mail" size={16} className="text-gold-500" />
                <span className="text-sm">hello@luxejewels.com</span>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="MapPin" size={16} className="text-gold-500" />
                <span className="text-sm">123 Jewelry District, NYC</span>
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2024 Luxe Jewels. All rights reserved. | 
              <Link to="/privacy" className="hover:text-gold-500 transition-colors ml-1">Privacy Policy</Link> | 
              <Link to="/terms" className="hover:text-gold-500 transition-colors ml-1">Terms of Service</Link>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gray-700 transition-all"
                    title={social.name}
                  >
                    <ApperIcon name={social.icon} size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">We accept:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <ApperIcon name="CreditCard" size={12} className="text-gray-400" />
                </div>
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <ApperIcon name="Smartphone" size={12} className="text-gray-400" />
                </div>
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <ApperIcon name="Shield" size={12} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;