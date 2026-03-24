import { useOutletContext } from 'react-router';
import { Button } from '../ui/button';
import { CourseCard } from '../CourseCard';
import { Video, Camera, TrendingUp, CheckCircle, Users, Clock, Star, ArrowRight, Zap } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ContextType {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function HomePage() {
  const { onNavigate, isLoggedIn, onOpenAuth } = useOutletContext<ContextType>();

  const featuredCourses = [
    {
      id: 'alphabet',
      title: 'ISL Alphabet Fundamentals',
      description: 'Master the 26 letters of the ISL alphabet with step-by-step guidance.',
      image: 'https://images.unsplash.com/photo-1725043394860-71304ce2b1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHBoYWJldCUyMGxldHRlcnN8ZW58MXx8fHwxNzYwNTM1NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      difficulty: 'Beginner Friendly',
    },
    {
      id: 'greetings',
      title: 'Everyday Greetings',
      description: 'Learn essential greetings and introductions for daily conversations.',
      image: 'https://images.unsplash.com/photo-1730875648975-e718e5658d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxsbyUyMGhhbmRzJTIwd2F2aW5nfGVufDF8fHx8MTc2MDUzNTkyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      difficulty: 'Beginner Friendly',
    },
    {
      id: 'numbers',
      title: 'Numbers 1-100',
      description: 'Build confidence with numerical signs for everyday use.',
      image: 'https://images.unsplash.com/photo-1653361860636-36f2fb89eab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudW1iZXJzJTIwbWF0aGVtYXRpY3N8ZW58MXx8fHwxNzYwNTM1NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      difficulty: 'Beginner Friendly',
    },
  ];

  const testimonials = [
    {
      name: 'Ananya Mehta',
      role: 'Student, Delhi University',
      text: 'ISL Connect helped me communicate better with my deaf classmates. The AI practice is incredibly helpful!',
      rating: 5,
    },
    {
      name: 'Rahul Kapoor',
      role: 'Teacher, Mumbai',
      text: 'An amazing platform for learning ISL. The gesture recognition technology makes practice so much more effective.',
      rating: 5,
    },
    {
      name: 'Sneha Patel',
      role: 'Healthcare Worker, Ahmedabad',
      text: 'Being able to sign basic medical terms has transformed how I serve deaf patients. Thank you, ISL Connect!',
      rating: 5,
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Learners' },
    { value: '500+', label: 'Signs Available' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '24/7', label: 'AI Practice' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm">AI-Powered Gesture Recognition</span>
              </div>
              <h1 className="text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Master Indian Sign Language with Intelligent Practice
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Harness cutting-edge gesture recognition to learn ISL at your own pace, with real-time feedback powered by AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => isLoggedIn ? onNavigate('dashboard') : onOpenAuth('signup')}
                  className="text-lg px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 border-0"
                >
                  Start Free Lesson
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('dashboard')}
                  className="text-lg px-8"
                >
                  Explore Courses
                </Button>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBvbmxpbmUlMjBlZHVjYXRpb258ZW58MXx8fHwxNzczNzIzOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students learning sign language"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg border p-4 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">AI Accuracy</span>
                </div>
                <p className="text-2xl text-secondary">92%</p>
                <p className="text-xs text-muted-foreground">Average recognition rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">How ISL Connect Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our three-step approach makes learning Indian Sign Language intuitive and effective
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:bg-card transition-all hover:shadow-lg group relative">
              <div className="absolute top-4 left-4 text-6xl text-primary/10">1</div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="mb-3">Watch & Learn</h3>
              <p className="text-muted-foreground">
                Engage with expert-led video lessons demonstrating authentic ISL signs with detailed explanations.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-card transition-all hover:shadow-lg group relative">
              <div className="absolute top-4 left-4 text-6xl text-secondary/10">2</div>
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-3">Practice with AI</h3>
              <p className="text-muted-foreground">
                Utilize your device's camera for instant, precise gesture recognition feedback powered by AI.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-card transition-all hover:shadow-lg group relative">
              <div className="absolute top-4 left-4 text-6xl text-accent/10">3</div>
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="mb-3">Track & Master</h3>
              <p className="text-muted-foreground">
                Monitor your progress, review challenging signs, and celebrate your achievements along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2">Popular Courses</h2>
              <p className="text-muted-foreground">Start with our most loved courses</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onViewCourse={() => onNavigate('course')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why ISL Connect Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Why Choose ISL Connect?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by experts, powered by AI, designed for everyone
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: 'Authentic Content', desc: 'Indian Sign Language content curated by certified ISL experts and deaf community members.' },
              { icon: Camera, title: 'AI Recognition', desc: 'Real-time gesture recognition powered by advanced computer vision and AI technology.' },
              { icon: Users, title: 'Expert Instructors', desc: 'Learn from experienced ISL teachers and members of the deaf community.' },
              { icon: Clock, title: 'Flexible Schedule', desc: 'Learn at your own pace, anytime and anywhere. Your progress syncs across devices.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-card hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">What Our Learners Say</h2>
            <p className="text-muted-foreground">Join thousands of happy ISL learners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary via-secondary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl mb-4 text-white">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of learners connecting with the deaf community through Indian Sign Language.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => isLoggedIn ? onNavigate('dashboard') : onOpenAuth('signup')}
            className="text-lg px-8"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Sign Up Free'}
          </Button>
        </div>
      </section>
    </div>
  );
}