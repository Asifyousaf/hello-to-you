
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([0]); // First FAQ is expanded by default
  
  const helpCategories = [
    { id: "getting-started", name: "Getting Started" },
    { id: "account", name: "Account & Settings" },
    { id: "workouts", name: "Workouts & Training" },
    { id: "nutrition", name: "Nutrition" },
    { id: "mindfulness", name: "Mindfulness" },
    { id: "billing", name: "Billing & Subscription" },
    { id: "technical", name: "Technical Issues" }
  ];
  
  const faqs = [
    {
      question: "How do I create a workout plan?",
      answer: "To create a workout plan, navigate to the Workouts tab and click on 'Create Workout Plan'. Follow the guided setup process where you'll select your fitness level, goals, available equipment, and preferred workout days. Our AI will then generate a personalized plan for you. You can always modify the plan later if needed."
    },
    {
      question: "Can I sync my fitness tracker?",
      answer: "Yes! WellnessAI supports integration with popular fitness trackers and smartwatches including Fitbit, Apple Watch, Garmin, and Google Fit. Go to your Profile settings, select 'Integrations', and follow the instructions to connect your device."
    },
    {
      question: "How do I track my progress?",
      answer: "Your progress is automatically tracked on your dashboard. You can view detailed stats and trends by clicking on the specific metric you want to explore. For workout progress, check the 'Progress' tab in the Workouts section to see improvements in strength, endurance, and other performance metrics over time."
    },
    {
      question: "Can I customize my meal plan?",
      answer: "Absolutely! In the Nutrition section, click 'Edit Meal Plan' to adjust your preferences. You can set dietary restrictions, favorite foods, foods to avoid, and adjust macronutrient ratios. The AI will regenerate meal suggestions based on your preferences while still aligning with your nutrition goals."
    },
    {
      question: "What if I miss a workout?",
      answer: "No problem! WellnessAI adapts to your schedule. If you miss a workout, the system will automatically adjust your plan. You can also manually reschedule workouts by dragging them to a new day on your calendar, or clicking the 'Reschedule' option on any missed workout."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "To cancel your subscription, go to your Profile, select 'Subscription', and click 'Manage Subscription'. From there, you'll find the option to cancel. Your benefits will continue until the end of your current billing period. We also offer the option to pause your subscription if you just need a temporary break."
    }
  ];
  
  const popularArticles = [
    { title: "Getting Started with WellnessAI: A Complete Guide", category: "Getting Started" },
    { title: "How to Track Your Fitness Progress Effectively", category: "Workouts & Training" },
    { title: "Creating Custom Meal Plans with Dietary Restrictions", category: "Nutrition" },
    { title: "Troubleshooting Account Login Issues", category: "Technical Issues" },
    { title: "Understanding Your Subscription Options", category: "Billing & Subscription" }
  ];
  
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };
  
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-600">Help Center</h1>
            
            {/* Search */}
            <div className="relative max-w-2xl mx-auto mb-10">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-4 text-gray-400" size={20} />
              </div>
            </div>
            
            {/* Help Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-10">
              {helpCategories.map((category) => (
                <motion.button
                  key={category.id}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    activeCategory === category.id 
                      ? "bg-purple-600 text-white" 
                      : "bg-white text-gray-700 hover:bg-purple-50"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FAQs */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Frequently Asked Questions</h2>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0">
                      <button
                        className="w-full flex items-center justify-between p-6 text-left"
                        onClick={() => toggleFaq(index)}
                      >
                        <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                        {expandedFaqs.includes(index) ? (
                          <ChevronUp className="text-purple-600" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={20} />
                        )}
                      </button>
                      <div 
                        className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                          expandedFaqs.includes(index) 
                            ? "max-h-96 pb-6" 
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Popular Articles & Contact */}
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Popular Articles</h2>
                  <ul className="space-y-3">
                    {popularArticles.map((article, index) => (
                      <li key={index}>
                        <a 
                          href="#" 
                          className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{article.title}</p>
                            <p className="text-sm text-gray-500">{article.category}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Button variant="link" className="text-purple-600 mt-4">
                    View All Articles →
                  </Button>
                </div>
                
                <div className="bg-purple-50 rounded-xl shadow-lg p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Need More Help?</h2>
                  <p className="text-gray-600 mb-6">
                    Couldn't find what you're looking for? Our support team is here to help.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white mb-3 w-full">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="border-purple-600 text-purple-600 w-full">
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenterPage;
