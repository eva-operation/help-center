import { Suspense } from "react";
import { HelpCenterClient } from "./HelpCenterClient";
import { listApps } from "../lib/apps";

export default async function Home() {
    const apps = await listApps();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HelpCenterClient apps={apps} />
        </Suspense>
    );
}
