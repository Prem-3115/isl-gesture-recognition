import { ArrowRight, BarChart3 } from "lucide-react@0.487.0";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

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
    <div className="group overflow-hidden rounded-[1.25rem] border border-white/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-video w-full overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-xl">{title}</h3>
        <p className="mb-5 text-sm leading-6 text-muted-foreground">{description}</p>

        {progress !== undefined ? (
          <div className="mb-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{lessonsCompleted}/{totalLessons} Lessons</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-slate-100" />
            <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <BarChart3 className="h-3.5 w-3.5" />
              {progress}% complete
            </p>
          </div>
        ) : difficulty ? (
          <div className="mb-5">
            <span className="inline-block rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 px-3 py-1 text-sm text-slate-700">
              {difficulty}
            </span>
          </div>
        ) : null}

        <Button
          onClick={() => onViewCourse(id)}
          className="bg-gradient-brand w-full rounded-xl border-0 text-white hover:opacity-90"
        >
          {progress !== undefined ? "Continue Course" : "View Course"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
