// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Reclamo Ciudadano</h1>
      <p>Empowering citizens to report issues in their communities.</p>
      <Link href="/models/claims/pages">View Claims</Link>
    </div>
  );
}
