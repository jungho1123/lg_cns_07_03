import { GalleryVerticalEnd } from 'lucide-react';
import { SignupSection } from '@/features/auth/containers/SignupSection';
export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-lg font-semibold">LG CNS 3조</span>
        </a>
        <SignupSection />
      </div>
    </div>
  );
}
