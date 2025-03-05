import { auth } from "auth"

export async function GET(request: Request) {
  const session = await auth()

  if (session) {
    return Response.json({ data: "Protected data" })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}
