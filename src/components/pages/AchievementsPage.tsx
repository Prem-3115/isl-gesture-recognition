import { useOutletContext } from 'react-router';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Award, Trophy, Medal, Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ContextType {
  onNavigate: (page: string) => void;
  userName: string;
}

export function AchievementsPage() {
  const { onNavigate, userName } = useOutletContext<ContextType>();

  const accuracyData = [
    { date: 'Mon', accuracy: 75 },
    { date: 'Tue', accuracy: 80 },
    { date: 'Wed', accuracy: 85 },
    { date: 'Thu', accuracy: 82 },
    { date: 'Fri', accuracy: 88 },
    { date: 'Sat', accuracy: 90 },
    { date: 'Sun', accuracy: 89 },
  ];

  const categoryData = [
    { category: 'Alphabet', signs: 26 },
    { category: 'Greetings', signs: 18 },
    { category: 'Numbers', signs: 35 },
    { category: 'Family', signs: 12 },
    { category: 'Common Words', signs: 33 },
  ];

  const masteryData = [
    { name: 'Expert', value: 45, color: '#8B5CF6' },
    { name: 'Proficient', value: 35, color: '#EC4899' },
    { name: 'Developing', value: 15, color: '#06B6D4' },
    { name: 'Beginner', value: 5, color: '#F1F5F9' },
  ];

  const achievements = [
    {
      id: 1,
      name: 'Alphabet Apprentice',
      description: 'Completed all alphabet lessons with >80% accuracy',
      icon: Award,
      achieved: true,
      date: 'Oct 1, 2025',
      color: 'text-secondary',
      bgColor: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
    },
    {
      id: 2,
      name: 'Greeting Guru',
      description: 'Mastered 15+ greeting signs',
      icon: Trophy,
      achieved: true,
      date: 'Sep 28, 2025',
      color: 'text-accent',
      bgColor: 'bg-gradient-to-br from-accent/20 to-accent/5',
    },
    {
      id: 3,
      name: '5-Day Streak',
      description: 'Practiced for 5 consecutive days',
      icon: Medal,
      achieved: true,
      date: 'Oct 5, 2025',
      color: 'text-primary',
      bgColor: 'bg-gradient-to-br from-primary/20 to-primary/5',
    },
    {
      id: 4,
      name: 'Perfect Practice',
      description: 'Achieved 100% accuracy on 10 signs',
      icon: Target,
      achieved: false,
      date: null,
      progress: 60,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      id: 5,
      name: 'Century Club',
      description: 'Mastered 100+ signs',
      icon: Trophy,
      achieved: true,
      date: 'Oct 10, 2025',
      color: 'text-secondary',
      bgColor: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
    },
    {
      id: 6,
      name: 'Early Bird',
      description: 'Complete 10 morning practice sessions',
      icon: Award,
      achieved: false,
      date: null,
      progress: 30,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  const challengingSigns = [
    { sign: 'Letter Q', accuracy: 68, attempts: 12 },
    { sign: 'Letter Z', accuracy: 72, attempts: 10 },
    { sign: 'Number 7', accuracy: 75, attempts: 8 },
    { sign: 'Thank You', accuracy: 76, attempts: 7 },
  ];

  const recentActivity = [
    { action: 'Completed Lesson: Letter D', time: '2 hours ago', type: 'lesson' },
    { action: 'Practiced "Hello" sign — 92% accuracy', time: '3 hours ago', type: 'practice' },
    { action: 'Earned "Century Club" badge', time: '1 day ago', type: 'achievement' },
    { action: 'Started Numbers 1-100 course', time: '2 days ago', type: 'course' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary via-secondary to-accent text-white rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <div className="flex flex-col md:flex-row items-center gap-6 relative">
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <span className="text-4xl">👤</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-white mb-1">{userName || 'Priya'} Sharma</h1>
              <p className="text-white/80 mb-3">ISL Learning Journey — Level 3 Learner</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 12-day streak
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> 4 badges earned
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Member since Sep 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Signs Learned', value: '124', icon: Target, gradient: 'from-primary/10 to-primary/5' },
            { label: 'Total Practice Time', value: '18.5h', icon: Calendar, gradient: 'from-secondary/10 to-secondary/5' },
            { label: 'Best Daily Streak', value: '12 days', icon: TrendingUp, gradient: 'from-accent/10 to-accent/5' },
            { label: 'Average Accuracy', value: '89%', icon: Award, gradient: 'from-primary/10 to-secondary/5' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements/Badges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2>Your Achievements</h2>
            <span className="text-sm text-muted-foreground">{achievements.filter(a => a.achieved).length} of {achievements.length} unlocked</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`bg-card rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${
                    achievement.achieved ? '' : 'opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${achievement.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.achieved && achievement.date && (
                        <p className="text-xs text-primary flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {achievement.date}
                        </p>
                      )}
                      {!achievement.achieved && (
                        <div className="mt-2">
                          <Progress value={achievement.progress ?? 0} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{achievement.progress ?? 0}% complete</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Progress Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Accuracy Over Time */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-6">Accuracy Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="url(#accuracyGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#EC4899' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Signs Mastered by Category */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-6">Signs Mastered by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="signs" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mastery Distribution + Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Mastery Distribution */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-6">Mastery Distribution</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={masteryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {masteryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {masteryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'achievement' ? 'bg-secondary' :
                    activity.type === 'practice' ? 'bg-accent' :
                    activity.type === 'lesson' ? 'bg-primary' :
                    'bg-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenging Signs Section */}
        <div>
          <h2 className="mb-4">Challenging Signs</h2>
          <p className="text-muted-foreground mb-6">Signs you might want to practice more</p>
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="divide-y">
              {challengingSigns.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                      <span className="text-accent text-sm">{item.accuracy}%</span>
                    </div>
                    <div>
                      <p className="mb-1">{item.sign}</p>
                      <p className="text-sm text-muted-foreground">{item.attempts} practice attempts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block w-32">
                      <Progress value={item.accuracy} className="h-2" />
                    </div>
                    <Button size="sm" onClick={() => onNavigate('practice')}>
                      Practice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}