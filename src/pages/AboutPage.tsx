
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-600">About WellnessAI</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At WellnessAI, we're on a mission to make personalized wellness accessible to everyone. We believe that 
                health and fitness journeys should be as unique as the individuals on them. By leveraging the power of 
                artificial intelligence, we provide tailored workout plans, nutrition guidance, and mindfulness practices 
                that adapt to your specific needs and goals.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                WellnessAI was founded in 2023 by a team of fitness enthusiasts, nutrition specialists, and AI engineers 
                who saw a gap in the wellness industry. Traditional fitness apps were either too generic or too complex, 
                making it difficult for many people to maintain their wellness journeys. We set out to create a platform 
                that would understand each user's unique circumstances and provide them with a simple, effective path to 
                better health.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Approach</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe in holistic wellness that encompasses physical fitness, nutrition, and mental well-being. 
                Our AI-powered platform analyzes your habits, preferences, and goals to create personalized 
                recommendations that work for your lifestyle. Whether you're a beginner or an experienced fitness 
                enthusiast, WellnessAI adapts to your level and helps you progress at your own pace.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-purple-600 font-bold text-xl mb-2">10K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-purple-600 font-bold text-xl mb-2">50+</div>
                  <div className="text-gray-600">Expert Coaches</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-purple-600 font-bold text-xl mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="CEO" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">Michael Chen</h3>
                  <p className="text-purple-600">CEO & Founder</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      alt="CTO" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                  <p className="text-purple-600">Chief Technology Officer</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/68.jpg" 
                      alt="Wellness Director" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">Emma Davis</h3>
                  <p className="text-purple-600">Wellness Director</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
