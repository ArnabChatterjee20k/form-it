import { withAuth } from "@workos-inc/authkit-nextjs"
import {NextRequest,NextResponse} from "next/server"
export async function GET(request:NextRequest){
    const {user} = await withAuth()
    return NextResponse.json(user)
}