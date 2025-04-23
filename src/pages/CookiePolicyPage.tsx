
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";

const CookiePolicyPage = () => {
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
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Cookie Policy</h1>
            <p className="text-gray-500 mb-8">Last Updated: {lastUpdated}</p>
            
            <div className="prose prose-purple max-w-none text-gray-700">
              <p>
                This Cookie Policy explains how WellnessAI ("we", "us", or "our") uses cookies and similar technologies 
                to recognize you when you visit our website and applications (collectively, the "Service"). It explains 
                what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">What are cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
                as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, WellnessAI) are called "first-party cookies". Cookies set 
                by parties other than the website owner are called "third-party cookies". Third-party cookies enable 
                third-party features or functionality to be provided on or through the website (e.g. advertising, interactive 
                content, and analytics). The parties that set these third-party cookies can recognize your computer both when 
                it visits the website in question and also when it visits certain other websites.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Why do we use cookies?</h2>
              <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
              reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" 
              cookies. Other cookies also enable us to track and target the interests of our users to enhance the 
              experience on our Service. Third parties serve cookies through our Service for advertising, analytics, 
              and other purposes.</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Types of cookies we use</h2>
              <p>The specific types of first and third-party cookies served through our Service and the purposes they 
              perform are described below:</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Essential Cookies</h3>
              <p>
                These cookies are strictly necessary to provide you with services available through our Service and to use 
                some of its features, such as access to secure areas. Because these cookies are strictly necessary to 
                deliver the Service, you cannot refuse them without impacting how our Service functions.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Performance and Functionality Cookies</h3>
              <p>
                These cookies are used to enhance the performance and functionality of our Service but are non-essential to 
                their use. However, without these cookies, certain functionality may become unavailable.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Analytics and Customization Cookies</h3>
              <p>
                These cookies collect information that is used either in aggregate form to help us understand how our Service 
                is being used or how effective our marketing campaigns are, or to help us customize our Service for you.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Advertising Cookies</h3>
              <p>
                These cookies are used to make advertising messages more relevant to you. They perform functions like preventing 
                the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some 
                cases selecting advertisements that are based on your interests.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Social Media Cookies</h3>
              <p>
                These cookies are used to enable you to share pages and content that you find interesting on our Service through 
                third-party social networking and other websites. These cookies may also be used for advertising purposes.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">How can you control cookies?</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences 
                by following the instructions provided in our cookie banner when you first visit our Service.
              </p>
              <p>
                You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, 
                you may still use our Service though your access to some functionality and areas of our Service may be restricted. 
                As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you 
                should visit your browser's help menu for more information.
              </p>
              <p>
                In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to 
                find out more information, please visit:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="http://www.aboutads.info/choices/" className="text-purple-600 hover:text-purple-800">Digital Advertising Alliance</a></li>
                <li><a href="https://youradchoices.ca/" className="text-purple-600 hover:text-purple-800">Digital Advertising Alliance of Canada</a></li>
                <li><a href="http://www.youronlinechoices.com/" className="text-purple-600 hover:text-purple-800">European Interactive Digital Advertising Alliance</a></li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">How often will we update this Cookie Policy?</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use 
                or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to 
                stay informed about our use of cookies and related technologies.
              </p>
              <p>
                The date at the top of this Cookie Policy indicates when it was last updated.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> cookies@wellnessai.com<br />
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

export default CookiePolicyPage;
