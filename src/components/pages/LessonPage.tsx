import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Button } from '../ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Maximize, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContextType {
  onNavigate: (page: string) => void;
}

export function LessonPage() {
  const { onNavigate } = useOutletContext<ContextType>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(33);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            setLessonCompleted(true);
            toast.success('Lesson video completed! Try practicing this sign now.');
            return 100;
          }
          return prev + 2;
        });
      }, 300);
    }
  };

  const handleMarkComplete = () => {
    setLessonCompleted(true);
    toast.success('Lesson marked as complete!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate('dashboard')} className="cursor-pointer">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate('course')} className="cursor-pointer">ISL Alphabet</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>The Letter 'A'</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Lesson Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-1">Lesson: The Letter 'A'</h1>
            <p className="text-sm text-muted-foreground">Lesson 2 of 10 • ISL Alphabet Fundamentals</p>
          </div>
          {!lessonCompleted ? (
            <Button variant="outline" onClick={handleMarkComplete}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          ) : (
            <span className="flex items-center gap-2 text-secondary text-sm">
              <CheckCircle className="w-5 h-5" />
              Completed
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden aspect-video mb-6 relative group shadow-lg">
              {/* Video Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">👊</div>
                  <p className="text-white/80 text-sm">ISL Sign: Letter A</p>
                </div>
              </div>

              {/* Play/Pause Button */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors hover:scale-110 transform duration-200 shadow-xl">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </button>
              )}

              {/* Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="mb-3">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-primary transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="text-white hover:text-primary transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="text-white text-sm">
                      {Math.floor(videoProgress * 6.3 / 100)}:{String(Math.floor((videoProgress * 6.3 / 100 % 1) * 60)).padStart(2, '0')} / 6:30
                    </span>
                  </div>
                  <button className="text-white hover:text-primary transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Lesson Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => onNavigate('course')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
              <Button onClick={() => onNavigate('course')}>
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Lesson Content Sidebar */}
          <div className="space-y-6">
            {/* Text Explanation */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h3 className="mb-4">How to Sign 'A'</h3>
              <div className="space-y-4">
                {[
                  { label: 'Handshape', desc: 'Closed fist with thumb placed alongside the fingers' },
                  { label: 'Movement', desc: 'Static (no movement required)' },
                  { label: 'Palm Orientation', desc: 'Palm faces away from the body' },
                  { label: 'Common Mistakes', desc: 'Thumb extended outward or tucked inside the fist' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-primary mb-1">{item.label}</p>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Reference */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h4 className="mb-4">Visual Reference</h4>
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <div className="text-6xl">👊</div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Reference image showing the letter 'A' from multiple angles
              </p>
            </div>

            {/* Practice CTA */}
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 border-0"
              size="lg"
              onClick={() => onNavigate('practice')}
            >
              Practice This Sign Now
            </Button>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
          <h3 className="mb-4">Key Learning Points</h3>
          <ul className="space-y-3">
            {[
              "The letter 'A' is one of the most fundamental signs in ISL alphabet",
              'Ensure your thumb is pressed firmly against your index finger',
              'This handshape is also used as a base for several other signs',
              'Practice in front of a mirror to check your hand position',
            ].map((point, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
