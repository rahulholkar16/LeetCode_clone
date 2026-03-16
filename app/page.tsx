import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  console.log("SESSION:: ", session);
  
  if (!session) {
    return <div> Not login... </div>
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <div>
              <h1>Welcome {session.user.name}</h1>
          </div>
      </div>
  );
}
