
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";

const TermsOfServicePage = () => {
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
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Terms of Service</h1>
            <p className="text-gray-500 mb-8">Last Updated: {lastUpdated}</p>
            
            <div className="prose prose-purple max-w-none text-gray-700">
              <p>
                Welcome to WellnessAI. These Terms of Service ("Terms") govern your use of the WellnessAI website, 
                mobile application, and services (collectively, the "Service"). By accessing or using the Service, 
                you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not 
                access the Service.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Account Registration</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your 
                account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any 
                activities or actions under your password. You agree not to disclose your password to any third party. 
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use of 
                your account.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. Subscription and Billing</h2>
              <p>
                Some parts of the Service are billed on a subscription basis. You will be billed in advance on a 
                recurring basis, depending on the type of subscription plan you select. You may cancel your subscription 
                at any time, but refunds are only provided in accordance with our Refund Policy.
              </p>
              <p>
                WellnessAI reserves the right to change subscription fees at any time, but will provide reasonable 
                notice before any fee change takes effect.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. Content and Services</h2>
              <p>
                Our Service allows you to access fitness programs, nutritional guidance, mindfulness exercises, and other 
                wellness content. The information provided through our Service is for general informational and educational 
                purposes only and is not intended as, and shall not be understood or construed as, professional medical 
                advice.
              </p>
              <p>
                We recommend consulting with a healthcare professional before starting any new exercise program or making 
                significant changes to your diet, particularly if you have any pre-existing health conditions.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding content provided by users), features, and functionality 
                are and will remain the exclusive property of WellnessAI and its licensors. The Service is protected by 
                copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              <p>
                Our name, logo, and all related names, logos, product and service names, designs, and slogans are 
                trademarks of WellnessAI or its affiliates or licensors. You must not use such marks without the prior 
                written permission of WellnessAI.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. User Content</h2>
              <p>
                Our Service may allow you to post, link, store, share and otherwise make available certain information, 
                text, graphics, videos, or other material ("User Content"). By providing User Content to the Service, you 
                grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such 
                content on and through the Service.
              </p>
              <p>
                You are solely responsible for the User Content that you post, upload, link to or otherwise make available 
                via the Service. You represent and warrant that: (1) the User Content does not violate any third-party 
                rights, including intellectual property rights or privacy rights; and (2) the User Content complies with 
                these Terms and all applicable laws.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Prohibited Uses</h2>
              <p>
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail" or "spam"</li>
                <li>To impersonate or attempt to impersonate WellnessAI, a WellnessAI employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                In no event shall WellnessAI, its directors, employees, partners, agents, suppliers, or affiliates, be liable 
                for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of 
                profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability 
                to access or use the Service.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
                including, without limitation, if you breach the Terms. Upon termination, your right to use the Service 
                will immediately cease.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and defined following the laws of [Your Country/State]. WellnessAI and 
                yourself irrevocably consent to the exclusive jurisdiction and venue of the courts in [Your City, Your 
                Country/State] for any disputes arising out of or relating to these Terms.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What 
                constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> terms@wellnessai.com<br />
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

export default TermsOfServicePage;
