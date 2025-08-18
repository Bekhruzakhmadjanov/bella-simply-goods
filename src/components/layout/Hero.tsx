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
      color: "text-sky-600"
    },
    {
      icon: CheckCircle,
      text: "Premium Ingredients",
      color: "text-sky-600"
    },
    {
      icon: CheckCircle,
      text: "Fresh Daily",
      color: "text-sky-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "4.9", label: "Average Rating", icon: Star },
    { number: "48hrs", label: "Fresh Delivery" }
  ];

  return (
    <section 
      className={`relative overflow-hidden py-24 px-4 bg-amber-200 ${className}`}
      style={backgroundImage ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-amber-600 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-500 rounded-full opacity-30 animate-pulse delay-1000" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center">
          {/* Main Content */}
          <div className="mb-12">
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tight ${
              backgroundImage ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
            
            <p className={`text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${
              backgroundImage ? 'text-gray-100' : 'text-gray-600'
            }`}>
              {subtitle}
            </p>

            {/* Features */}
            {showFeatures && (
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {features.map(({ icon: Icon, text, color }, index) => (
                  <div 
                    key={text}
                    className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
                  >
                    <Icon className={color} size={18} />
                    <span className="text-gray-700 font-medium text-sm">{text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {onGetStarted && (
              <div className="mb-16">
                <Button 
                  onClick={onGetStarted}
                  variant="primary"
                  size="large"
                  className="inline-flex items-center px-8 py-4 text-lg shadow-lg hover:shadow-xl"
                >
                  Shop Collection
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map(({ number, label, icon: Icon }, index) => (
              <div 
                key={label}
                className={`text-center p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 ${
                  backgroundImage ? 'text-white' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl md:text-4xl font-light text-gray-900">{number}</span>
                  {Icon && <Icon className="ml-2 text-yellow-400" size={24} />}
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };