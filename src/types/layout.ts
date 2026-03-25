export interface LayoutOutletContext {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  userName: string;
  onOpenAuth: (mode?: "login" | "signup") => void;
}
