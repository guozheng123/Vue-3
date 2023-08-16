import { defineComponent, Suspense, useSlots } from 'vue';

import { Skeleton } from 'ant-design-vue';

const LoadingCom = defineComponent({
    setup() {
        const slots = useSlots();
        return () => (
            <Suspense
                v-slots={{
                    ...slots,
                    fallback: () => <Skeleton active />
                }}
            />
        );
    }
});

export default LoadingCom;
