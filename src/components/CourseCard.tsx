import { ArrowRight, BarChart3 } from "lucide-react";
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
  index?: number;
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
  index = 0,
  onViewCourse,
}: CourseCardProps) {
  return (
    <div 
      className="card-enter group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover hover:border-slate-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">{description}</p>

        <div className="mt-auto">
          {progress !== undefined ? (
          <div className="mb-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-900">{lessonsCompleted}/{totalLessons} Lessons</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-100" />
            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
              {progress}% complete
            </p>
          </div>
        ) : difficulty ? (
          <div className="mb-6">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
              {difficulty}
            </span>
          </div>
        ) : null}

          <Button
            onClick={() => onViewCourse(id)}
            className="group/btn w-full rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/95 hover:shadow-md active:scale-[0.98]"
          >
            {progress !== undefined ? "Continue Course" : "View Course"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

