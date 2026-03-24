import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  progress?: number;
  difficulty?: string;
  lessonsCompleted?: number;
  totalLessons?: number;
  onViewCourse: (id: string) => void;
}

export function CourseCard({
  id,
  title,
  description,
  image,
  progress,
  difficulty,
  lessonsCompleted,
  totalLessons,
  onViewCourse,
}: CourseCardProps) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="aspect-video w-full overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {progress !== undefined ? (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{lessonsCompleted}/{totalLessons} Lessons</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : difficulty ? (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-muted text-sm rounded-full">
              {difficulty}
            </span>
          </div>
        ) : null}
        
        <Button onClick={() => onViewCourse(id)} className="w-full">
          {progress !== undefined ? 'Continue Course' : 'View Course'}
        </Button>
      </div>
    </div>
  );
}
