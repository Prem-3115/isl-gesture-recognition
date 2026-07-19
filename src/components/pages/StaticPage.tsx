import { useLocation } from "react-router";
import { BookOpen, Shield, HelpCircle, Mail, Accessibility } from "lucide-react";

export function StaticPage() {
  const location = useLocation();
  const path = location.pathname.replace("/", "");
  
  let title = "Information";
  let content = <p>This page is currently under construction.</p>;
  let Icon = BookOpen;

  switch (path) {
    case "help":
      title = "Help Center";
      Icon = HelpCircle;
      content = (
        <div className="space-y-6">
          <p className="lead text-xl text-slate-700">How can we help you today?</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Getting Started</h3>
          <p>Welcome to ISL Connect! To begin your journey, navigate to the Dashboard and click on the "Learn ISL Alphabet" course. Make sure your webcam is enabled so our AI can provide real-time feedback on your hand gestures.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Camera & Privacy</h3>
          <p>Your privacy is our priority. All gesture recognition happens directly in your browser. We never record, upload, or store your webcam footage on our servers.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Having Trouble?</h3>
          <p>If your camera isn't working, ensure you've granted browser permissions. If you're stuck on a specific sign, try adjusting your lighting or hand positioning to match the reference chart more closely.</p>
        </div>
      );
      break;
    case "accessibility":
      title = "Accessibility Statement";
      Icon = Accessibility;
      content = (
        <div className="space-y-6">
          <p>ISL Connect is committed to ensuring digital accessibility for people with all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Conformance Status</h3>
          <p>We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. These guidelines explain how to make web content more accessible for people with disabilities.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Feedback</h3>
          <p>We welcome your feedback on the accessibility of ISL Connect. Please let us know if you encounter accessibility barriers on our platform so we can work to address them immediately.</p>
        </div>
      );
      break;
    case "contact":
      title = "Contact Us";
      Icon = Mail;
      content = (
        <div className="space-y-6">
          <p>We'd love to hear from you! Whether you have a question about features, need technical support, or just want to share your ISL learning journey, our team is ready to answer all your questions.</p>
          
          <div className="mt-8 rounded-xl bg-slate-50 p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Support</h3>
            <p className="mb-4">For general inquiries and technical assistance:</p>
            <a href="mailto:support@islconnect.edu" className="text-primary font-medium hover:underline">support@islconnect.edu</a>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Partnerships</h3>
            <p className="mb-4">Interested in bringing ISL Connect to your school or organization?</p>
            <a href="mailto:partners@islconnect.edu" className="text-primary font-medium hover:underline">partners@islconnect.edu</a>
          </div>
        </div>
      );
      break;
    case "privacy":
      title = "Privacy Policy";
      Icon = Shield;
      content = (
        <div className="space-y-6">
          <p>At ISL Connect, we take your privacy seriously. This policy describes what personal information we collect and how we use it.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Information Collection</h3>
          <p>We collect information you provide directly to us, such as when you create or modify your account, or contact customer support. This may include your name, email address, and learning progress.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Webcam & AI Analysis</h3>
          <p><strong>Crucially:</strong> All video processing for gesture recognition is performed locally on your device. We do not transmit, record, or store any video feeds from your webcam. The AI models run entirely in your browser.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">Data Usage</h3>
          <p>We use your learning progress data strictly to provide personalized recommendations, track your achievements, and improve the educational pathways on our platform.</p>
        </div>
      );
      break;
    case "terms":
      title = "Terms of Service";
      Icon = BookOpen;
      content = (
        <div className="space-y-6">
          <p>Welcome to ISL Connect. By accessing our platform, you agree to these terms of service and our privacy policy.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">1. Acceptance of Terms</h3>
          <p>By registering for and/or using the Services in any manner, including but not limited to visiting or browsing the Site, you agree to these Terms of Service and all other operating rules, policies and procedures.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">2. Educational Purpose</h3>
          <p>ISL Connect is an educational tool designed to assist in learning Indian Sign Language. While we strive for high accuracy with our AI models, the platform should be used as a supplementary learning tool rather than a replacement for certified ISL instruction.</p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-8">3. User Conduct</h3>
          <p>You agree not to use the platform for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Community features must be used respectfully, fostering an inclusive learning environment for everyone.</p>
        </div>
      );
      break;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          {content}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
