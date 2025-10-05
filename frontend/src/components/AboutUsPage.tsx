import React from 'react';
import { ArrowLeft, Brain, Users, Target, Lightbulb, Heart, Mail, Linkedin, Github, User } from 'lucide-react';
import PixelCard from './PixelCard';

// Import team member images - Add your actual image files to src/assets/team/
// You can use .jpg, .png, or any image format
// Example: import rohanImage from '../assets/team/rohan.jpg';

interface AboutUsPageProps {
  onBack: () => void;
}

// Team members data
const teamMembers = [
  {
    name: 'Rohan Gore',
    email: 'rmg9725@nyu.edu',
    linkedin: 'https://www.linkedin.com/in/rohan-g0re/',
    github: 'https://github.com/rohan-g0re',
    image: '/team/rohan.jpg', // Update with actual image path
    variant: 'blue' as const,
  },
  {
    name: 'Sahil Sarnaik',
    email: 'ss19100@nyu.edu',
    linkedin: 'https://www.linkedin.com/in/sahil-sarnaik-244834299/',
    github: 'https://github.com/Sahilms48',
    image: '/team/sahil.jpg', // Update with actual image path
    variant: 'green' as const,
  },
  {
    name: 'Pradeep Kulkarni',
    email: 'pradeep.k@nyu.edu',
    linkedin: 'https://www.linkedin.com/in/pradeep05/',
    github: 'https://github.com/Vectors0505',
    image: '/team/pradeep.jpg', // Update with actual image path
    variant: 'pink' as const,
  },
  // {
  //   name: 'Sarah Williams',
  //   role: 'Product Designer',
  //   email: 'sarah.williams@vizkidd.com',
  //   linkedin: 'https://linkedin.com/in/sarahwilliams',
  //   github: 'https://github.com/sarahwilliams',
  //   variant: 'blue' as const,
  // },
];

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-['Manrope']">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 sticky top-0 z-50 bg-[#0A192F]/80 backdrop-blur-md border-b border-blue-800/20">
        <div className="w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <Brain className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">VizKidd</h1>
          </div>
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] bg-clip-text text-transparent">
            About VizKidd
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Transforming complex concepts into beautiful, interactive visualizations that make learning accessible and engaging for everyone.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                At VizKidd, we believe that learning should be visual, interactive, and accessible. 
                Our platform transforms complex academic concepts into stunning visualizations that 
                help students understand and retain information more effectively.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Whether you're studying mathematics, science, literature, or any other subject, 
                VizKidd makes abstract concepts tangible through the power of visual storytelling.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#38BDF8]/10 to-[#6C9CFF]/10 p-8 rounded-2xl border border-blue-800/20">
              <Target className="h-16 w-16 text-[#38BDF8] mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Visual Learning</h3>
              <p className="text-white/70">
                We specialize in creating interactive diagrams, flowcharts, and concept maps 
                that bring your studies to life.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#38BDF8]/5 to-transparent p-6 rounded-xl border border-blue-800/20 hover:border-blue-800/40 transition-all">
              <Lightbulb className="h-12 w-12 text-[#38BDF8] mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered</h3>
              <p className="text-white/70">
                Our advanced AI understands your content and creates the most effective 
                visualizations for your specific learning needs.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#6C9CFF]/5 to-transparent p-6 rounded-xl border border-blue-800/20 hover:border-blue-800/40 transition-all">
              <Users className="h-12 w-12 text-[#6C9CFF] mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">User-Friendly</h3>
              <p className="text-white/70">
                Simple, intuitive interface that makes creating professional visualizations 
                accessible to students of all technical levels.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#38BDF8]/5 to-transparent p-6 rounded-xl border border-blue-800/20 hover:border-blue-800/40 transition-all">
              <Heart className="h-12 w-12 text-[#38BDF8] mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Student-Focused</h3>
              <p className="text-white/70">
                Built by students, for students. We understand the challenges of learning 
                and create tools that actually help.
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Section - NEW */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <PixelCard key={index} variant={member.variant} className="h-[360px] w-full">
                <div className="absolute inset-0 p-6 z-10 flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className="mb-4 relative">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white/10 shadow-lg"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/10 ${member.image ? 'hidden' : ''}`}>
                      <User className="h-12 w-12 text-white/50" />
                    </div>
                  </div>
                  
                  <div className="mb-auto">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  </div>
                  
                  <div className="space-y-3 w-full mt-4">
                    {/* Email */}
                    <a 
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="text-sm truncate text-left">{member.email}</span>
                    </a>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 justify-center">
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-500/20 transition-colors group"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5 text-white/80 group-hover:text-blue-400 transition-colors" />
                      </a>
                      <a 
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 transition-colors group"
                        title="GitHub"
                      >
                        <Github className="h-5 w-5 text-white/80 group-hover:text-purple-400 transition-colors" />
                      </a>
                    </div>
                  </div>
                </div>
              </PixelCard>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Story</h2>
          <div className="bg-gradient-to-r from-[#38BDF8]/10 to-[#6C9CFF]/10 p-8 rounded-2xl border border-blue-800/20">
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              VizKidd was born from a simple observation: students learn better when they can see 
              and interact with concepts visually. As students ourselves, we experienced firsthand 
              the struggle of trying to understand complex theories and abstract ideas from textbooks alone.
            </p>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              We set out to create a platform that would bridge the gap between complex academic 
              content and visual understanding. Using cutting-edge AI technology and modern web design, 
              we've built a tool that transforms any text into beautiful, interactive visualizations.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Today, VizKidd helps thousands of students worldwide turn their studies into visual 
              masterpieces, making learning not just more effective, but more enjoyable too.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#38BDF8] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Accessibility</h3>
                  <p className="text-white/70">Learning should be accessible to everyone, regardless of background or technical skill.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#6C9CFF] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-white/70">We continuously push the boundaries of what's possible in educational technology.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#38BDF8] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quality</h3>
                  <p className="text-white/70">Every visualization is crafted with attention to detail and educational effectiveness.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#6C9CFF] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
                  <p className="text-white/70">We build tools that bring students together and foster collaborative learning.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#38BDF8] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Empathy</h3>
                  <p className="text-white/70">We understand the student experience because we are students ourselves.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#6C9CFF] rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Growth</h3>
                  <p className="text-white/70">We believe in continuous improvement and evolving with our users' needs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#38BDF8]/10 to-[#6C9CFF]/10 p-8 rounded-2xl border border-blue-800/20">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Learning?</h2>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already using VizKidd to make their studies more visual and effective.
            </p>
            <button 
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#38BDF8]/30 transition-all"
            >
              Start Visualizing Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 px-6 md:px-12 border-t border-blue-800/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold text-white">VizKidd</span>
          </div>
          <p className="text-white/60">
            Making learning visual, one concept at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
