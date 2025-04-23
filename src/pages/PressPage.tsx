
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PressPage = () => {
  const pressReleases = [
    {
      title: "WellnessAI Raises $10M in Series A Funding",
      date: "April 10, 2025",
      description: "WellnessAI, the leading AI-powered wellness platform, announced today that it has raised $10 million in Series A funding led by Health Ventures with participation from Fitness Capital and AI Fund."
    },
    {
      title: "WellnessAI Launches Revolutionary Adaptive Workout Technology",
      date: "March 15, 2025",
      description: "WellnessAI has announced the launch of its new Adaptive Workout Technology, a breakthrough innovation that uses machine learning to adjust workout intensity in real-time based on user performance."
    },
    {
      title: "WellnessAI Partners with Major Health Insurance Provider",
      date: "February 5, 2025",
      description: "WellnessAI has announced a strategic partnership with BlueCross BlueShield to offer premium wellness services to insurance members at discounted rates."
    },
    {
      title: "WellnessAI Reaches 1 Million User Milestone",
      date: "January 20, 2025",
      description: "WellnessAI has announced that it has reached 1 million active users, a significant milestone for the wellness platform that launched just 18 months ago."
    }
  ];
  
  const mediaFeatures = [
    {
      outlet: "TechCrunch",
      title: "How WellnessAI is Disrupting the Fitness Industry",
      image: "https://placehold.it/600x400?text=TechCrunch+Feature"
    },
    {
      outlet: "Forbes",
      title: "The Future of Fitness: AI-Powered Personalization",
      image: "https://placehold.it/600x400?text=Forbes+Feature"
    },
    {
      outlet: "The New York Times",
      title: "Can AI Make Us Healthier? WellnessAI Says Yes",
      image: "https://placehold.it/600x400?text=NYT+Feature"
    }
  ];
  
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
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-600">Press & Media</h1>
            
            <div className="bg-purple-50 rounded-xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Media Inquiries</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For press and media inquiries, please contact our PR team. We're happy to provide information, 
                interviews, and assets for your stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Contact Press Team
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Download Press Kit
                </Button>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Press Releases</h2>
            <div className="grid grid-cols-1 gap-6 mb-12">
              {pressReleases.map((release, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="text-sm text-purple-600 mb-2">{release.date}</div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">{release.title}</h3>
                  <p className="text-gray-600 mb-4">{release.description}</p>
                  <Button variant="link" className="text-purple-600 p-0">
                    Read Full Release →
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Media Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {mediaFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="text-sm text-purple-600 mb-1">{feature.outlet}</div>
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <Button variant="link" className="text-purple-600 p-0 mt-2">
                      Read Article →
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Brand Assets</h2>
              <p className="text-gray-600 mb-6">
                Download our logo, screenshots, and other brand assets for use in your publication.
                Please refer to our brand guidelines when using these assets.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Download Brand Assets
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PressPage;
