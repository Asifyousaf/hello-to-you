
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";

const PrivacyPolicyPage = () => {
  // Last updated date
  const lastUpdated = "April 10, 2025";
  
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
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last Updated: {lastUpdated}</p>
            
            <div className="prose prose-purple max-w-none text-gray-700">
              <p>
                At WellnessAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our website and services.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <p>We may collect information about you in a variety of ways including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, 
                  and telephone number that you voluntarily provide when registering or using our services.
                </li>
                <li>
                  <strong>Health and Fitness Data:</strong> Information about your physical characteristics, fitness level, 
                  exercise habits, nutritional intake, and wellness goals.
                </li>
                <li>
                  <strong>Device Information:</strong> Information about your mobile device or computer such as your IP address, 
                  browser type, operating system, and app usage data.
                </li>
                <li>
                  <strong>Usage Information:</strong> Information about how you use our website and services, including 
                  your browsing actions and patterns.
                </li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p>We may use the information we collect about you for various purposes, including to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience with our platform</li>
                <li>Generate personalized workout plans and nutrition recommendations</li>
                <li>Communicate with you about your account, updates, or promotional materials</li>
                <li>Monitor and analyze usage trends and preferences</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Respond to your inquiries and provide customer support</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Disclosure of Your Information</h2>
              <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary 
                  to comply with the law or protect our rights or the rights of others.
                </li>
                <li>
                  <strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors 
                  who provide services on our behalf (e.g., payment processing, data analysis, email delivery).
                </li>
                <li>
                  <strong>Marketing Communications:</strong> With your consent, we may share your information with third 
                  parties for marketing purposes.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a 
                  portion of our assets, your information may be transferred as part of that transaction.
                </li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. 
                While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
                that despite our efforts, no security measures are perfect or impenetrable, and no method of data 
                transmission can be guaranteed against any interception or other type of misuse.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights Regarding Your Data</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to object to processing of your personal information</li>
                <li>The right to request restriction of processing</li>
                <li>The right to data portability</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Children's Privacy</h2>
              <p>
                Our services are not intended for use by children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided us 
                with personal information, please contact us so we can delete the information.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@wellnessai.com<br />
                <strong>Address:</strong> 123 Wellness Way, Health City, HC 12345<br />
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;
