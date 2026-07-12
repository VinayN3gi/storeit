import { getLoggedInUser } from "@/lib/action/user.action";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function Home() {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  redirect("/home");
}
