import { Suspense } from "react";
import { HelpCenterClient } from "../HelpCenterClient";
import { listApps } from "../../lib/apps";

export const revalidate = 60;

export default async function InternalHome() {
    const publicApps = await listApps("Public");
    const internalApps = await listApps("Internal Only");

    // Combine and remove duplicates
    const allAppsMap = new Map();
    [...publicApps, ...internalApps].forEach(app => allAppsMap.set(app.id, app));
    const apps = Array.from(allAppsMap.values());

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HelpCenterClient apps={apps} isInternal={true} />
        </Suspense>
    );
}
