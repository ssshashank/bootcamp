import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest } from "@solana/actions"
import { Connection, PublicKey } from "@solana/web3.js";

export const OPTIONS = GET;
export async function GET(request: Request) {
    const actionMetaData: ActionGetResponse = {
        icon: "https://cookieandkate.com/images/2025/01/peanut-butter-recipe.jpg",
        title: "Vote for your favorite type of peanut butter",
        description: "Vote between cruncy and smooth peanut butter",
        label: "Vote",
        links: <any>{
            actions: [
                {
                    label: "Vote for crunchy",
                    href: "/api/vote?candidate=crunchy",
                },
                {
                    label: "Vote for smooth",
                    href: "/api/vote?candidate=smooth",
                }
            ]
        }
    };
    return Response.json(actionMetaData, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if (candidate !== 'crunchy' && candidate !== 'smooth') {
        return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

    const body: ActionPostRequest = await request.json();
    let voter;
    try {

        voter = new PublicKey(body.account);
    } catch (err) {
        return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }
}
