
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Star, Heart, Share2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const StorePage = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Yoga Mat',
      price: 49.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=2294&q=80',
      description: 'Extra thick, non-slip yoga mat perfect for all types of yoga.',
      category: 'equipment',
      amazonLink: 'https://www.amazon.com/s?k=yoga+mat'
    },
    {
      id: 2,
      name: 'Resistance Band Set',
      price: 29.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=2274&q=80',
      description: 'Set of 5 resistance bands for strength training and rehabilitation.',
      category: 'equipment',
      amazonLink: 'https://www.amazon.com/s?k=resistance+bands'
    },
    {
      id: 3,
      name: 'Plant-based Protein Powder',
      price: 39.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c1b1d4b13?q=80&w=2340&q=80',
      description: 'Organic plant-based protein with 25g protein per serving.',
      category: 'nutrition',
      amazonLink: 'https://www.amazon.com/s?k=plant+based+protein'
    },
    {
      id: 4,
      name: 'Fitness Tracker Watch',
      price: 99.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=2488&q=80',
      description: 'Tracks steps, sleep, heart rate, and workouts with 7-day battery life.',
      category: 'equipment',
      amazonLink: 'https://www.amazon.com/s?k=fitness+tracker'
    },
    {
      id: 5,
      name: 'Meditation Cushion',
      price: 34.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2340&q=80',
      description: 'Comfortable buckwheat-filled cushion for meditation practice.',
      category: 'mindfulness',
      amazonLink: 'https://www.amazon.com/s?k=meditation+cushion'
    },
    {
      id: 6,
      name: 'BCAA Supplement',
      price: 24.99,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1579722819315-2e21e1013f90?q=80&w=2340&q=80',
      description: 'Branched-Chain Amino Acids for muscle recovery and growth.',
      category: 'nutrition',
      amazonLink: 'https://www.amazon.com/s?k=bcaa+supplement'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Wellness Store</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            High-quality products to support your wellness journey, carefully selected by our fitness experts.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="equipment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'equipment').map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'nutrition').map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mindfulness">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'mindfulness').map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: string;
    description: string;
    category: string;
    amazonLink: string;
  }
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription className="mt-1">${product.price}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <div className="flex items-center mt-2 text-amber-500">
          <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
          <span className="ml-1 text-sm">{product.rating}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <a 
          href={product.amazonLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
            <ShoppingBag className="h-4 w-4" />
            <span>Buy Now</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </a>
      </CardFooter>
      <div className="flex border-t">
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none border-r"
        >
          <Heart className="h-4 w-4 mr-1" />
          <span className="text-xs">Save</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none"
        >
          <Share2 className="h-4 w-4 mr-1" />
          <span className="text-xs">Share</span>
        </Button>
      </div>
    </Card>
  );
};

export default StorePage;
