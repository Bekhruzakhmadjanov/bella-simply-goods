import React from 'react';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroProps {
  title?: string;
  subtitle?: string;
  onGetStarted?: () => void;
  showFeatures?: boolean;
  backgroundImage?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Authentic Dubai Chocolate",
  subtitle = "Experience the viral sensation that took the world by storm. Handcrafted with premium pistachios, crispy kataifi, and the finest chocolate - delivered fresh to your doorstep across the USA.",
  onGetStarted,
  showFeatures = true,
  backgroundImage,
  className = ''
}) => {
  const features = [
    {
      icon: CheckCircle,
      text: "100% Homemade",
      color: "text-green-600"
    },
    {
      icon: CheckCircle,
      text: "Premium Ingredients",
      color: "text-amber-600"
    },
    {
      icon: CheckCircle,
      text: "Fresh Daily",
      color: "text-green-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "4.9", label: "Average Rating", icon: Star },
    { number: "48hrs", label: "Fresh Delivery" }
  ];

  return (
    <section 
      className={`relative overflow-hidden py-24 px-6 bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 ${className}`}
      style={backgroundImage ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full opacity-30 animate-pulse blur-xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-30 animate-pulse delay-1000 blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full opacity-20 animate-bounce delay-500 blur-lg" />

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Main Content */}
        <div className="mb-16">
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight ${
            backgroundImage ? 'text-white' : 'bg-gradient-to-r from-yellow-800 via-amber-800 to-yellow-900 bg-clip-text text-transparent'
          }`}>
            {title}
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-medium ${
            backgroundImage ? 'text-gray-100' : 'text-gray-700'
          }`}>
            {subtitle}
          </p>

          {/* Features */}
          {showFeatures && (
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {features.map(({ icon: Icon, text, color }) => (
                <div 
                  key={text}
                  className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-green-100 transform hover:scale-105 transition-all duration-300"
                >
                  <Icon className={color} size={22} />
                  <span className="text-gray-800 font-semibold">{text}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {onGetStarted && (
            <div className="mb-20">
              <Button 
                onClick={onGetStarted}
                variant="primary"
                size="large"
                className="inline-flex items-center px-12 py-5 text-xl"
              >
                Shop Collection
                <ArrowRight className="ml-3" size={24} />
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map(({ number, label, icon: Icon }) => (
            <div 
              key={label}
              className={`text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-green-100 shadow-xl transform hover:scale-105 transition-all duration-300 ${
                backgroundImage ? 'text-white' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <span className={`text-4xl md:text-5xl font-bold ${
                  backgroundImage ? 'text-white' : 'bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent'
                }`}>
                  {number}
                </span>
                {Icon && <Icon className="ml-2 text-amber-400 drop-shadow-sm" size={28} />}
              </div>
              <p className={`text-lg font-semibold ${
                backgroundImage ? 'text-gray-100' : 'text-gray-700'
              }`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hero };