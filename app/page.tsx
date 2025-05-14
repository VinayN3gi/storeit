import { getLoggedInUser } from "@/lib/action/user.action";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
 const user=await getLoggedInUser();
  if(!user) redirect("/sign-up");

  redirect("/sign-in")

  return (
    <div className="flex-center h-screen">
      <h1 className="text-brand">Hello</h1>
    </div>
  );
}
