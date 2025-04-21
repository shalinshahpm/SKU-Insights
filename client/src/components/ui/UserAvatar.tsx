import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/lib/types";

interface UserAvatarProps {
  user: User;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, className = "", size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
