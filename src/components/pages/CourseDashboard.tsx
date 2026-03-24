import { useOutletContext } from 'react-router';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CourseCard } from '../CourseCard';
import { ChartNoAxesColumn, Flame, Target, BookOpen, Clock, Award } from 'lucide-react';

interface ContextType {
  onNavigate: (page: string) => void;
  userName: string;
}

export function CourseDashboard() {
  const { onNavigate, userName } = useOutletContext<ContextType>();

  const activeCourses = [
    {
      id: 'alphabet',
      title: 'ISL Alphabet Fundamentals',
      description: 'Master the 26 letters of the ISL alphabet.',
      image: 'https://images.unsplash.com/photo-1725043394860-71304ce2b1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHBoYWJldCUyMGxldHRlcnN8ZW58MXx8fHwxNzYwNTM1NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 40,
      lessonsCompleted: 4,
      totalLessons: 10,
    },
    {
      id: 'greetings',
      title: 'Everyday Greetings',
      description: 'Learn essential greetings and introductions.',
      image: 'https://images.unsplash.com/photo-1730875648975-e718e5658d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxsbyUyMGhhbmRzJTIwd2F2aW5nfGVufDF8fHx8MTc2MDUzNTkyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 75,
      lessonsCompleted: 6,
      totalLessons: 8,
    },
    {
      id: 'numbers',
      title: 'Numbers 1-100',
      description: 'Build confidence with numerical signs.',
      image: 'https://images.unsplash.com/photo-1653361860636-36f2fb89eab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudW1iZXJzJTIwbWF0aGVtYXRpY3N8ZW58MXx8fHwxNzYwNTM1NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 20,
      lessonsCompleted: 2,
      totalLessons: 10,
    },
  ];

  const recentSigns = [
    { sign: 'Letter A', accuracy: 92, time: '2 min ago' },
    { sign: 'Hello', accuracy: 88, time: '15 min ago' },
    { sign: 'Thank You', accuracy: 95, time: '1 hour ago' },
    { sign: 'Number 5', accuracy: 85, time: '2 hours ago' },
  ];

  const weeklyGoals = [
    { label: 'Practice Sessions', current: 4, target: 5 },
    { label: 'New Signs', current: 8, target: 10 },
    { label: 'Accuracy Goal', current: 89, target: 90 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="mb-2">Welcome back, {userName || 'Priya'}!</h1>
          <p className="text-muted-foreground">Your next lesson awaits — keep up the great progress!</p>
        </div>

        {/* Continue Learning Card */}
        <div className="bg-gradient-to-br from-primary via-secondary to-accent text-white rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
            <div className="flex-1">
              <p className="text-sm text-white/80 mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Continue Your Journey
              </p>
              <h2 className="text-white text-2xl mb-2">ISL Alphabet: Vowels</h2>
              <p className="text-white/90 mb-4">Lesson 5: The Letter 'E' — You're making great progress!</p>
              <div className="max-w-md">
                <div className="flex justify-between text-sm mb-2 text-white/80">
                  <span>Course Progress</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-2 bg-white/20" />
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('lesson')}
              className="whitespace-nowrap"
            >
              Continue Lesson
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Overview */}
          <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/60 rounded-xl flex items-center justify-center shadow-md">
                <ChartNoAxesColumn className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3>Progress Overview</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Completion</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-2">Weekly Goals</p>
                {weeklyGoals.map((goal) => (
                  <div key={goal.label} className="flex items-center justify-between text-sm py-1">
                    <span className="text-muted-foreground">{goal.label}</span>
                    <span className={goal.current >= goal.target ? 'text-secondary' : 'text-foreground'}>
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/60 rounded-xl flex items-center justify-center shadow-md">
                <Target className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3>Your Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl mb-1">124</p>
                <p className="text-sm text-muted-foreground">Signs Mastered</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl mb-1">89%</p>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl mb-1">18.5h</p>
                <p className="text-sm text-muted-foreground">Practice Time</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl mb-1">3</p>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </div>

          {/* Learning Streak */}
          <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3>Learning Streak</h3>
            </div>
            <div className="text-center py-4">
              <p className="text-4xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">12</p>
              <p className="text-muted-foreground mb-4">Day Streak</p>
              <div className="flex justify-center gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      i < 5
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best streak</span>
              <span className="text-sm flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                15 days
              </span>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2>My Active Courses</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate('home')}>
              Browse More
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onViewCourse={() => onNavigate('course')}
              />
            ))}
          </div>
        </div>

        {/* Recently Practiced Signs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Recently Practiced Signs</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate('achievements')}>
              View All Progress
            </Button>
          </div>
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="divide-y">
              {recentSigns.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate('practice')}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-lg">
                      {item.sign.includes('Letter') ? item.sign.split(' ')[1] : '#'}
                    </div>
                    <div className="text-left">
                      <span className="block">{item.sign}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-sm ${item.accuracy >= 90 ? 'text-secondary' : 'text-accent'}`}>
                        {item.accuracy}% Accuracy
                      </span>
                    </div>
                    <span className="text-sm text-primary">Practice →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
