## API

### TpfTable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fontSize | 表格主体部分字体大小 | string ｜ number | 14 |
| showRowSelection | 是否显示多选按钮 | boolean | false |
| columns | 表格列配置 [参考 antd 的写](https://www.antdv.com/components/table-cn/#Column) | - | - |
| operateColumn | 表格操作栏的配置 [参考 antd 的写](https://www.antdv.com/components/table-cn/#Column) | - | - |
| 其他参数 | 表格的配置项目写法一样 [参考 antd 的写](https://www.antdv.com/components/table-cn/#Table) | - | - |

### TpfTableOperateColumn

| 参数       | 说明                       | 类型                                       | 默认值 |
| ---------- | -------------------------- | ------------------------------------------ | ------ |
| defaultBtn | 操作栏默认显示的按钮       | {title:string,onClick:(attrs,row)=>void}[] | []     |
| moreBtn    | 操作栏隐藏在更多按钮里面的 | {title:string,onClick:(attrs,row)=>void}[] | []     |

### TpfColumnDialog

| 插槽 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| footerLeft | 弹窗底部左侧按钮 | vNode | - |
| footerRight | 弹窗底部右侧按钮 | vNode | - |
| 其他参数 | 表格的配置项目写法一样 [参考 antd 的写](https://www.antdv.com/components/modal-cn#API) | - | - |

### withTpfTableOperateColumn

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| 第一层参数 | 将 customerRender 的参数全部传进来 | - | - |
| 第二层参数 -1, defaultBtn | 操作栏默认显示的按钮的 list | {title:string,onClick:(attrs,row)=>void}[] | [] |
| 第二层参数 -2, moreBtn | 操作栏隐藏在更多按钮里面的 list | {title:string,onClick:(attrs,row)=>void}[] | [] |
