
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";
import { Shield, MessageSquare, Users, AlertCircle, ThumbsUp, X } from 'lucide-react';

const CommunityGuidelinesPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Community Guidelines</h1>
            </div>
            
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Our community is built on trust, respect, and a shared passion for wellness. 
              These guidelines help ensure that WellnessAI remains a positive, supportive, and safe environment for everyone.
            </p>
            
            {/* Core Values */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <Users className="h-6 w-6 text-purple-600 mr-2" />
                Our Community Values
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Inclusivity & Respect</h3>
                  <p className="text-gray-600">
                    We welcome members of all backgrounds, experience levels, body types, and abilities. 
                    Discrimination, harassment, or disparaging comments based on race, gender, sexuality, 
                    religion, body size, or any other personal characteristic have no place in our community.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Encouragement & Support</h3>
                  <p className="text-gray-600">
                    We're here to lift each other up. Offer constructive feedback, share success stories, 
                    and support others through challenges. Remember that everyone's wellness journey is unique.
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Safety & Responsibility</h3>
                  <p className="text-gray-600">
                    Health and safety come first. Do not promote extreme diet or exercise practices, 
                    dangerous challenges, or any content that could lead to physical or mental harm.
                  </p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Authenticity & Honesty</h3>
                  <p className="text-gray-600">
                    Share genuine experiences and be truthful in your interactions. Misleading information, 
                    false claims about results, or deceptive content undermines community trust.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Dos and Don'ts */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Community Dos and Don'ts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <ThumbsUp className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Do</h3>
                  </div>
                  
                  <ul className="space-y-3 pl-9">
                    <li className="text-gray-600 relative before:content-['✓'] before:absolute before:left-[-25px] before:text-green-600 before:font-bold">
                      <span className="font-medium">Share your journey</span> - Progress updates, challenges, and victories are welcome!
                    </li>
                    <li className="text-gray-600 relative before:content-['✓'] before:absolute before:left-[-25px] before:text-green-600 before:font-bold">
                      <span className="font-medium">Ask questions</span> - Seeking advice from the community is encouraged.
                    </li>
                    <li className="text-gray-600 relative before:content-['✓'] before:absolute before:left-[-25px] before:text-green-600 before:font-bold">
                      <span className="font-medium">Offer encouragement</span> - Support others with positive, constructive comments.
                    </li>
                    <li className="text-gray-600 relative before:content-['✓'] before:absolute before:left-[-25px] before:text-green-600 before:font-bold">
                      <span className="font-medium">Share useful resources</span> - Articles, recipes, and tips that have helped you.
                    </li>
                    <li className="text-gray-600 relative before:content-['✓'] before:absolute before:left-[-25px] before:text-green-600 before:font-bold">
                      <span className="font-medium">Report concerns</span> - Help us maintain community standards by reporting content that violates guidelines.
                    </li>
                    <li className="text-gray-600 relative before:content-['✓'] before:absolute before:left-[-25px] before:text-green-600 before:font-bold">
                      <span className="font-medium">Respect privacy</span> - Get permission before sharing someone else's content or story.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <X className="h-6 w-6 text-red-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Don't</h3>
                  </div>
                  
                  <ul className="space-y-3 pl-9">
                    <li className="text-gray-600 relative before:content-['✗'] before:absolute before:left-[-25px] before:text-red-600 before:font-bold">
                      <span className="font-medium">Give medical advice</span> - Unless you're a verified healthcare professional, avoid diagnostic or treatment advice.
                    </li>
                    <li className="text-gray-600 relative before:content-['✗'] before:absolute before:left-[-25px] before:text-red-600 before:font-bold">
                      <span className="font-medium">Promote harmful content</span> - No extreme diets, dangerous workouts, or unhealthy behaviors.
                    </li>
                    <li className="text-gray-600 relative before:content-['✗'] before:absolute before:left-[-25px] before:text-red-600 before:font-bold">
                      <span className="font-medium">Use offensive language</span> - No hate speech, profanity, or derogatory terms.
                    </li>
                    <li className="text-gray-600 relative before:content-['✗'] before:absolute before:left-[-25px] before:text-red-600 before:font-bold">
                      <span className="font-medium">Spam or self-promote</span> - Don't flood the community with repetitive content or unsolicited promotions.
                    </li>
                    <li className="text-gray-600 relative before:content-['✗'] before:absolute before:left-[-25px] before:text-red-600 before:font-bold">
                      <span className="font-medium">Body shame</span> - No comments that criticize bodies or promote unrealistic standards.
                    </li>
                    <li className="text-gray-600 relative before:content-['✗'] before:absolute before:left-[-25px] before:text-red-600 before:font-bold">
                      <span className="font-medium">Share unauthorized content</span> - Don't post copyrighted material without permission.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Content Guidelines */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <MessageSquare className="h-6 w-6 text-purple-600 mr-2" />
                Content Guidelines
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Photos & Videos</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>All photos and videos should be appropriate for viewing by users of all ages.</li>
                    <li>Progress photos are welcome but should be tasteful and focus on fitness achievements.</li>
                    <li>When sharing workout videos, ensure proper form is demonstrated.</li>
                    <li>Do not share images of minors without parental consent.</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Text Posts & Comments</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Keep language clean and respectful.</li>
                    <li>Provide context and details when asking for advice or sharing experiences.</li>
                    <li>Use content warnings when discussing potentially sensitive topics.</li>
                    <li>Cite sources when sharing scientific or nutritional information.</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 text-gray-800">Sharing External Content</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Only share links from reputable sources.</li>
                    <li>Provide a brief summary of why you're sharing the content.</li>
                    <li>Avoid sharing content that promotes products without disclosing affiliations.</li>
                    <li>Do not share links to harmful, misleading, or inappropriate content.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Enforcement & Reporting */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <AlertCircle className="h-6 w-6 text-purple-600 mr-2" />
                Enforcement & Reporting
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  Our community guidelines are enforced to ensure everyone has a positive and safe experience. 
                  Violations of these guidelines may result in:
                </p>
                
                <ul className="space-y-2 text-gray-600 list-disc pl-5 mb-6">
                  <li>Content removal</li>
                  <li>Warnings</li>
                  <li>Temporary restrictions</li>
                  <li>Account suspension or termination in severe cases</li>
                </ul>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-medium text-gray-800 mb-2">How to Report a Concern:</p>
                  <ol className="space-y-1 text-gray-600 list-decimal pl-5">
                    <li>Click the "..." menu on the post or comment</li>
                    <li>Select "Report"</li>
                    <li>Choose the appropriate reason</li>
                    <li>Add any additional context if prompted</li>
                    <li>Submit your report</li>
                  </ol>
                  <p className="mt-3 text-sm text-gray-600">
                    All reports are reviewed by our moderation team and kept confidential.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Closing Statement */}
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <p className="text-gray-700">
                These guidelines may be updated periodically as our community evolves. Thank you for being part of 
                the WellnessAI community and helping to create a positive, supportive environment for wellness journeys.
              </p>
              <p className="mt-4 font-medium text-purple-600">
                Last updated: April 15, 2025
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityGuidelinesPage;
