规范

git rm --cached src/types/components.d.ts

-   组件名字采用大驼峰(除了 index)

    ```jsx
    <AddModal />
    ```

-   文件夹名字采用小驼峰

    ```jsx
    //  addInfo/AddModal.vue
    ```

-   每个组件行数 最大不可超过 500 行(template + script + style), 超过 500 行请抽离组件

-   公用组件放在 src/components/\*\*/\*.vue

-   当前页面所需组件方法本文件内的 components src/views/\*/components/\*\*.vue

-   路由页面组件统一采用 index.vue 文件名称 ：src/views/\*/index.vue

-   ts 类型尽可能不要给 any(对于以前的，慢慢替换成类型)

-   导入组件采用异步导入 - 并采用 LoadingSkeleton 包裹 (TpfModal 除外)

    ```jsx
    <LoadingSkeleton>
        <AA />
    </LoadingSkeleton>;

    const AA = defineAsyncComponent(() => import('@/**/**.vue'));
    ```

-   封装的公用组件,给出说明文档或者使用案例（需要添加组件功能，优先找组件封装的人）

-   组件如果没有插槽,默认采用单标签

    ```jsx
    <ACom />
    ```

    插槽优先考虑 jsx/tsx 写法

-   utils 方法 优先考虑 lodash-es 内部提供的 按需加载

    ```jsx
    import { cloneDeep } from 'lodash-es';
    ```

-   接口需要捕获错误 使用 tryCatch 或者采用封装好的 useRequest 方法

    ```jsx
    try {
        await api();
    } catch (error) {
        // handleError TODO
    } finally {
        // finally TODO
    }

    const [res, error, loading] = await useRequest(api); //不用传参的
    const [res, error, loading] = await useRequest(() => {
        return api('参数');
    }); //要传参的
    if (error) return; // 有error 停止
    // .....TODO
    ```

-   绑定 Dom 变量定义为 xxxDom-并给类型

    ```jsx
    <ACom ref='modalDom' />
    const ACom = defineAsyncComponent(()=>import('./..vue'))
    const modalDom = ref<<InstanceType<typeof ACom> | null>>(null)
    ```

-   样式统一采用一个最大的父节点 类名 包裹样式 .root:{//.....}

    ```jsx
    <style lang="less" scoped>
        .root{
            .a{
                //..
            }
            .b{
                //..
            }
        }
    </style>
    ```

-   尽可能最小粒度的封装组件

-   代码各个 api 放置位置参考下面

-   每一部分之间采用一行空行分割

    ```jsx
    const a = ref(1);

    const b = ref(2);
    ```

-   页面级别的 vue 文件只能存在一个根节点(注释掉的也不行)

-   组件 props 说明

    ```jsx
    // - 可选参数
    type Props ={
        name:string;
        age:number;
        info:{height:number , width:number}
    }

    Partial<Props> // 等价于{name?:string ; age?:number,info?:{height:number , width:number}}

    //  组件给默认参数
    withDefaults(defineProps<Props>(), {
        name:'zs',
        age:18
        info: () => {};// 引用类型使用函数返回
        })
    ```

    ```jsx
        <template>
            <TpfModal />
        </template>

        <script setup lang="tsx" name='组件名'>
        //空对象
        1- Record<string, any>
        2-  {[k:string]:any}
          /******* vue dependencies start *******/
            /******* vue dependencies end *******/

            /******* components start *******/
            /******* components end *******/

            /******* types start *******/
            /******* types end *******/

            /******* props start *******/
            /******* props end *******/

            /******* emits start *******/
            /******* emits end *******/

            /******* state start *******/
            /******* state end *******/

            /******* computed start *******/
            /******* computed end *******/

            /******* watch start *******/
            /******* watch end *******/

            /******* methods start *******/
            /******* methods end *******/

            /******* lifecycle end *******/
            /******* lifecycle end *******/
        </script>

        <style lang="less" scoped>
            .root{
                .a{
                    //..
                }
                .b{
                    //..
                }
            }
        </style>
    ```
