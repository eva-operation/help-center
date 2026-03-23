import { Suspense } from "react";
import { HelpCenterClient } from "./HelpCenterClient";
import { listApps } from "../lib/apps";

export const revalidate = 300; // revalidate every 5 minutes

export default async function Home() {
    const apps = await listApps();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HelpCenterClient apps={apps} />
        </Suspense>
    );
}
