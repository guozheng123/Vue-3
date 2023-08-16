/**
 * Listening to routes alone would waste rendering performance. Use the publish-subscribe model for distribution management
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import { log } from 'console';
import mitt, { Handler } from 'mitt';
import type { RouteLocationNormalized } from 'vue-router';

const emitter = mitt();

const key = Symbol('ROUTE_CHANGE');

let latestRoute: RouteLocationNormalized;

export function setRouteEmitter(to: RouteLocationNormalized) {
    emitter.emit(key, to);
    latestRoute = to;
}

export function listenerRouteChange(
    handler: (route: RouteLocationNormalized) => void,
    immediate = true
) {
    emitter.on(key, handler as Handler);
    if (immediate && latestRoute) {
        handler(latestRoute);
    }
}

export function removeRouteListener() {
    emitter.off(key);
}
export function notFoundRouter(data: any, indexArray = [], all = []) {
    const arr = Array.from(indexArray) as any;
    for (let i = 0, len = data.length; i < len; i++) {
        const children = data[i].children;
        if (children && children.length) {
            notFoundRouter(children, arr, all);
        } else {
            arr.push(data[i].path);

            const joinArr = arr.join();
            if (!all.includes(joinArr as never)) {
                all.push(joinArr as never);
            }
        }
        arr.pop();
    }
    return all;
}
