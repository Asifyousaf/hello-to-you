
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const featuredPost = {
    id: "1",
    title: "The Science Behind Personalized Fitness Plans",
    excerpt: "Discover how AI is revolutionizing the way we approach fitness by creating truly personalized workout plans that adapt to your progress.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "April 15, 2025",
    author: "Dr. Sarah Johnson",
    authorRole: "Fitness Director",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    category: "Fitness"
  };
  
  const posts = [
    {
      id: "2",
      title: "5 Nutrition Myths Debunked by Science",
      excerpt: "Let's separate fact from fiction when it comes to popular nutrition advice that might be doing more harm than good.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "April 12, 2025",
      author: "Michael Chen",
      category: "Nutrition"
    },
    {
      id: "3",
      title: "Mindfulness Meditation: A Beginner's Guide",
      excerpt: "Learn how to start a mindfulness practice that can reduce stress and improve your overall wellbeing in just minutes a day.",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "April 8, 2025",
      author: "Emma Davis",
      category: "Mindfulness"
    },
    {
      id: "4",
      title: "How to Stay Motivated on Your Fitness Journey",
      excerpt: "Struggling to stay consistent with your workout routine? These evidence-based strategies will help you stay on track.",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "April 5, 2025",
      author: "Jason Williams",
      category: "Motivation"
    },
    {
      id: "5",
      title: "The Perfect Post-Workout Recovery Routine",
      excerpt: "Maximize your results and minimize soreness with this comprehensive approach to recovery after intense workouts.",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "April 1, 2025",
      author: "Taylor Rodriguez",
      category: "Recovery"
    },
    {
      id: "6",
      title: "Build a Home Gym on Any Budget",
      excerpt: "You don't need expensive equipment to get a great workout at home. Here's how to create an effective setup at any price point.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "March 28, 2025",
      author: "Alex Kim",
      category: "Equipment"
    }
  ];
  
  const categories = ["All", "Fitness", "Nutrition", "Mindfulness", "Recovery", "Motivation", "Equipment"];
  
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-600">WellnessAI Blog</h1>
            
            {/* Featured Post */}
            <div className="mb-12">
              <motion.div 
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64 md:h-auto">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                          Featured
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {featuredPost.category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-3">{featuredPost.title}</h2>
                      <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <img 
                          src={featuredPost.authorImage} 
                          alt={featuredPost.author} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{featuredPost.author}</p>
                          <p className="text-sm text-gray-500">{featuredPost.authorRole}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{featuredPost.date}</span>
                    </div>
                    
                    <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                      Read Article
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === "All" 
                      ? "bg-purple-600 text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <Button variant="link" className="text-purple-600 p-0">
                        Read More →
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Newsletter */}
            <div className="mt-16 bg-purple-50 rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get the latest articles, workout tips, nutrition advice, and exclusive offers delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
