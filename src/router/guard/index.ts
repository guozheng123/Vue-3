import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/routeListener';

function setupPageGuard(router: Router) {
    router.beforeEach(async to => {
        // emit route change
        setRouteEmitter(to);
    });
}

export default function createRouteGuard(router: Router) {
    setupPageGuard(router);
}
