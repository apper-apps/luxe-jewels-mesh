import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { cn } from '@/utils/cn'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { Card } from '@/components/atoms/Card'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, getItemCount, clearCart } = useCart()
  const { products } = useProducts()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    sameAsShipping: true
  })

  const [errors, setErrors] = useState({})

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      navigate('/')
    }
  }, [cartItems, navigate])

  const steps = [
    { number: 1, title: 'Shipping', icon: 'Truck' },
    { number: 2, title: 'Payment', icon: 'CreditCard' },
    { number: 3, title: 'Review', icon: 'CheckCircle' }
  ]

  // Calculate totals
const getProductById = (productId) => {
    return (products || []).find(p => p?.Id == productId)
  }

  const calculateSubtotal = () => {
return (cartItems || []).reduce((sum, item) => {
      const product = getProductById(item?.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal > 500 ? 0 : 25
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Validation functions
  const validateShipping = () => {
    const newErrors = {}
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid'
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required'
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required'
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required'
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required'
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = () => {
    const newErrors = {}
    
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
    else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number is invalid'
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required'
    else if (paymentInfo.cvv.length < 3) newErrors.cvv = 'CVV is invalid'
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required'

    if (!paymentInfo.sameAsShipping) {
      if (!paymentInfo.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required'
      if (!paymentInfo.billingCity.trim()) newErrors.billingCity = 'Billing city is required'
      if (!paymentInfo.billingState.trim()) newErrors.billingState = 'Billing state is required'
      if (!paymentInfo.billingZipCode.trim()) newErrors.billingZipCode = 'Billing ZIP code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2)
      toast.success('Shipping information saved')
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3)
      toast.success('Payment information saved')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form changes
  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  // Place order
  const placeOrder = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart
      clearCart()
      
      toast.success('Order placed successfully! You will receive a confirmation email shortly.')
      
      // Navigate to success page or home
      navigate('/', { replace: true })
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back to Cart</span>
          </button>
          
          <h1 className="text-3xl font-display font-bold text-gray-900">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-8 mb-12">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-blue-600 to-gold-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-500"
                    )}
                  >
                    <ApperIcon name={step.icon} size={20} />
                  </div>
                  <span className={cn(
                    "text-sm font-medium mt-2",
                    currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-20 h-0.5 mx-4 transition-colors",
                    currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          value={shippingInfo.firstName}
                          onChange={(e) => handleShippingChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={shippingInfo.lastName}
                          onChange={(e) => handleShippingChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => handleShippingChange('email', e.target.value)}
                          placeholder="Enter email address"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <Input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => handleShippingChange('phone', e.target.value)}
                          placeholder="Enter phone number"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Input
                          value={shippingInfo.address}
                          onChange={(e) => handleShippingChange('address', e.target.value)}
                          placeholder="Enter street address"
                          className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Input
                          value={shippingInfo.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          placeholder="Enter city"
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <Input
                          value={shippingInfo.state}
                          onChange={(e) => handleShippingChange('state', e.target.value)}
                          placeholder="Enter state"
                          className={errors.state ? 'border-red-500' : ''}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <Input
                          value={shippingInfo.zipCode}
                          onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                          placeholder="Enter ZIP code"
                          className={errors.zipCode ? 'border-red-500' : ''}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-8">
                      <Button onClick={nextStep} size="lg">
                        Continue to Payment
                        <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <Input
                            value={paymentInfo.cardNumber}
                            onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className={errors.cardNumber ? 'border-red-500' : ''}
                          />
                          {errors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <Input
                            value={paymentInfo.expiryDate}
                            onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            maxLength="5"
                            className={errors.expiryDate ? 'border-red-500' : ''}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <Input
                            value={paymentInfo.cvv}
                            onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                            placeholder="123"
                            maxLength="4"
                            className={errors.cvv ? 'border-red-500' : ''}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <Input
                            value={paymentInfo.cardName}
                            onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                            placeholder="Enter name on card"
                            className={errors.cardName ? 'border-red-500' : ''}
                          />
                          {errors.cardName && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="sameAsShipping"
                            checked={paymentInfo.sameAsShipping}
                            onChange={(e) => handlePaymentChange('sameAsShipping', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                            Billing address is the same as shipping address
                          </label>
                        </div>
                        
                        {!paymentInfo.sameAsShipping && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Billing Address *
                              </label>
                              <Input
                                value={paymentInfo.billingAddress}
                                onChange={(e) => handlePaymentChange('billingAddress', e.target.value)}
                                placeholder="Enter billing address"
                                className={errors.billingAddress ? 'border-red-500' : ''}
                              />
                              {errors.billingAddress && (
                                <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                              </label>
                              <Input
                                value={paymentInfo.billingCity}
                                onChange={(e) => handlePaymentChange('billingCity', e.target.value)}
                                placeholder="Enter city"
                                className={errors.billingCity ? 'border-red-500' : ''}
                              />
                              {errors.billingCity && (
                                <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                              </label>
                              <Input
                                value={paymentInfo.billingState}
                                onChange={(e) => handlePaymentChange('billingState', e.target.value)}
                                placeholder="Enter state"
                                className={errors.billingState ? 'border-red-500' : ''}
                              />
                              {errors.billingState && (
                                <p className="text-red-500 text-sm mt-1">{errors.billingState}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP Code *
                              </label>
                              <Input
                                value={paymentInfo.billingZipCode}
                                onChange={(e) => handlePaymentChange('billingZipCode', e.target.value)}
                                placeholder="Enter ZIP code"
                                className={errors.billingZipCode ? 'border-red-500' : ''}
                              />
                              {errors.billingZipCode && (
                                <p className="text-red-500 text-sm mt-1">{errors.billingZipCode}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={prevStep}>
                        <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Shipping
                      </Button>
                      <Button onClick={nextStep} size="lg">
                        Review Order
                        <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                    
                    {/* Shipping Info Summary */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.email}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>
                    
                    {/* Payment Info Summary */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        <p>{paymentInfo.cardName}</p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
{(cartItems || []).map((item) => {
                          const product = getProductById(item?.productId)
                          if (!product) return null
                          
                          return (
                            <div key={item.Id} className="flex items-center gap-4 py-3 border-b border-gray-200">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-gray-900">
                                {formatPrice(product.price * item.quantity)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={prevStep}>
                        <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Payment
                      </Button>
                      <Button 
                        onClick={placeOrder}
                        disabled={isProcessing}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-gold-600 hover:from-blue-700 hover:to-gold-700"
                      >
                        {isProcessing ? (
                          <>
                            <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Place Order {formatPrice(total)}
                            <ApperIcon name="Check" size={16} className="ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getItemCount()} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              {shipping === 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
                    <p className="text-sm text-green-800 font-medium">
                      Free shipping on orders over $500
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Shield" size={12} />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="RefreshCw" size={12} />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Award" size={12} />
                  <span>Lifetime warranty included</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage