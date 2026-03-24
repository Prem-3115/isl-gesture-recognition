import { useOutletContext } from 'react-router';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckCircle, Circle, PlayCircle, Clock, Users, Star, Download } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ContextType {
  onNavigate: (page: string) => void;
}

export function CoursePage() {
  const { onNavigate } = useOutletContext<ContextType>();

  const lessons = [
    { id: 1, title: 'Introduction to ISL', status: 'completed', duration: '8 min' },
    { id: 2, title: 'The Letter A', status: 'completed', duration: '6 min' },
    { id: 3, title: 'The Letter B', status: 'completed', duration: '6 min' },
    { id: 4, title: 'The Letter C', status: 'completed', duration: '6 min' },
    { id: 5, title: 'The Letter D', status: 'in-progress', duration: '6 min' },
    { id: 6, title: 'The Letter E', status: 'not-started', duration: '6 min' },
    { id: 7, title: 'The Letter F', status: 'not-started', duration: '6 min' },
    { id: 8, title: 'The Letter G', status: 'not-started', duration: '6 min' },
    { id: 9, title: 'Review: Letters A-G', status: 'not-started', duration: '10 min' },
    { id: 10, title: 'Practice Test', status: 'not-started', duration: '15 min' },
  ];

  const courseInfo = [
    { icon: Clock, label: 'Duration', value: '2.5 hours' },
    { icon: PlayCircle, label: 'Lessons', value: '10 lessons' },
    { icon: Users, label: 'Enrolled', value: '12,450+' },
    { icon: Star, label: 'Rating', value: '4.8/5' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Course Banner */}
      <div className="relative overflow-hidden py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-72 aspect-video rounded-xl overflow-hidden border shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1725043394860-71304ce2b1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHBoYWJldCUyMGxldHRlcnN8ZW58MXx8fHwxNzYwNTM1NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="ISL Alphabet Course"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
                <Star className="w-3 h-3 fill-primary" />
                Bestseller
              </div>
              <h1 className="mb-4">ISL Alphabet Fundamentals</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Master the complete ISL alphabet with expert-led video lessons and AI-powered practice.
                Build a strong foundation for your sign language journey.
              </p>

              {/* Course Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {courseInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-2">
                    <info.icon className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{info.label}</p>
                      <p className="text-sm">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span>4/10 Lessons Completed</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div className="flex gap-3">
                <Button size="lg" onClick={() => onNavigate('lesson')}>
                  Resume Course
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('practice')}>
                  Quick Practice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="mb-6">Course Curriculum</h2>
        <div className="bg-card rounded-xl border shadow-sm divide-y">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onNavigate('lesson')}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left group"
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {lesson.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-secondary" />
                ) : lesson.status === 'in-progress' ? (
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <PlayCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Lesson {lesson.id}</span>
                  {lesson.status === 'in-progress' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">In Progress</span>
                  )}
                </div>
                <p className={lesson.status === 'not-started' ? 'text-muted-foreground' : ''}>
                  {lesson.title}
                </p>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
              </div>

              {/* Hover arrow */}
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          ))}
        </div>

        {/* Course Resources */}
        <div className="mt-12">
          <h2 className="mb-4">Course Resources</h2>
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="space-y-3">
              {[
                { name: 'ISL Alphabet Chart (PDF)', size: '2.4 MB' },
                { name: 'Practice Exercises Workbook', size: '5.1 MB' },
                { name: 'Common Mistakes Guide', size: '1.8 MB' },
              ].map((resource) => (
                <button
                  key={resource.name}
                  className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-primary" />
                    <span>{resource.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{resource.size}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
