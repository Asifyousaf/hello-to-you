
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";
import { AlertTriangle, ThumbsUp, Heart, CheckCircle, Info, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

const SafetyCenterPage = () => {
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
            <div className="flex items-center justify-center mb-8">
              <Shield className="mr-3 text-purple-600" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Safety Center</h1>
            </div>
            
            <p className="text-center text-gray-600 mb-12 text-lg">
              Your health and safety are our top priorities. Learn how to use WellnessAI safely and get support when you need it.
            </p>
            
            {/* Safety Tips Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <AlertTriangle className="mr-2 text-orange-500" size={24} />
                Important Safety Guidelines
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Before Starting Any Program</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Consult with your healthcare provider before beginning any new fitness or nutrition program</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Be honest about your current fitness level and any health conditions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Start gradually and increase intensity over time</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">During Workouts</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Listen to your body and stop if you experience pain (not normal muscle fatigue)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Stay hydrated and take breaks when needed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Use proper form to prevent injuries</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                  <AlertTriangle className="mr-2 text-red-500" size={20} />
                  Warning Signs to Stop Exercising
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chest pain or pressure</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Severe shortness of breath</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dizziness or lightheadedness</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Irregular heartbeat</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Nausea or cold sweats</span>
                  </li>
                </ul>
                <div className="mt-4 text-red-600 font-medium">
                  If you experience any of these symptoms, stop exercising immediately and seek medical attention if necessary.
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                  <ThumbsUp className="mr-2 text-green-500" size={20} />
                  Best Practices for Safety
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Update your health profile regularly as your conditions change</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Follow the recommended progression for exercises</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Report any unexpected adverse effects through the app</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Don't skip warm-up and cool-down sections of workouts</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Nutrition Safety Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <Heart className="mr-2 text-red-500" size={24} />
                Nutrition Safety
              </h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Dietary Restrictions & Allergies</h3>
                  <p className="text-gray-700 mb-4">
                    Always ensure your dietary restrictions and food allergies are accurately recorded in your profile. 
                    Our system will avoid suggesting foods that conflict with your restrictions, but it's important 
                    to double-check all ingredient lists.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Update Dietary Restrictions
                  </Button>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Nutritional Balance</h3>
                  <p className="text-gray-700">
                    While our AI strives to create balanced meal plans, remember that individual nutritional needs vary. 
                    WellnessAI meal suggestions should complement, not replace, professional nutritional advice, 
                    especially if you have specific health conditions like diabetes, heart disease, or eating disorders.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                    <Info className="mr-2 text-blue-500" size={20} />
                    Medical Conditions & Nutrition
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">Diabetes:</span>
                      <span>Always monitor your blood sugar levels and follow your healthcare provider's guidance on carbohydrate intake.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">Heart Disease:</span>
                      <span>Pay special attention to sodium, saturated fat, and cholesterol in the meal recommendations.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">Kidney Disease:</span>
                      <span>You may need to limit certain nutrients like potassium, phosphorus, and protein.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">Pregnancy:</span>
                      <span>Nutritional needs are different during pregnancy; consult with a healthcare provider about safe nutrition plans.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Community Guidelines */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Community Guidelines</h2>
              
              <p className="text-gray-700 mb-6">
                Our community is a place for support and encouragement. To keep it a positive and safe space for everyone,
                please follow these guidelines:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-gray-800">Be Respectful</h3>
                  <p className="text-gray-700">
                    Treat others with dignity and kindness. Avoid posting content that is offensive, discriminatory, or harmful.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-gray-800">No Medical Advice</h3>
                  <p className="text-gray-700">
                    Do not offer or solicit medical advice in the community. Encourage others to seek professional guidance for health concerns.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-gray-800">Privacy</h3>
                  <p className="text-gray-700">
                    Respect others' privacy. Do not share personal information without consent.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-gray-800">Report Concerns</h3>
                  <p className="text-gray-700">
                    If you see content that violates our guidelines or concerns you, please report it immediately.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  View Full Community Guidelines
                </Button>
              </div>
            </div>
            
            {/* Emergency Contact Section */}
            <div className="bg-red-50 rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Emergency Information</h2>
              <p className="text-gray-700 mb-6">
                In case of a medical emergency, please contact emergency services immediately.
              </p>
              <div className="bg-white rounded-lg p-6 inline-block">
                <p className="text-xl font-bold text-red-600">Emergency: 911</p>
                <p className="text-gray-600">(or your local emergency number)</p>
              </div>
              <p className="mt-6 text-gray-700">
                WellnessAI is not a substitute for professional medical care. Always consult with healthcare 
                professionals for medical advice.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SafetyCenterPage;
