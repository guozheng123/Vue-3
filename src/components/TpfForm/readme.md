## API

### TpfForm

| 参数       | 说明          | 类型  | 默认值 |
| ---------- | ------------- | ----- | ------ |
| modelValue | 头部 slot     | vnode | -      |
| formList   | 内容区域 slot | vnode | -      |

### TpfSearchForm

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| collapse | 是否折叠 | boolean | false |
| formState(v-model:formState) | 需要绑定的字段 | - | - |
| formList | 动态渲染查询表单的配置项 | - | - |
| formProps | form 组件的的其他需要的参数-[参数](https://www.antdv.com/components/form-cn/#API) | - | - |
| rowProps | row 组件的的其他需要的参数-[参数](https://www.antdv.com/components/grid-cn/#Row) | - | - |
| colProps | col 组件的的其他需要的参数-[参数](https://www.antdv.com/components/grid-cn/#Col) | - | - |
| formItemProps | FormItem 组件的的其他需要的参数-[参数](https://www.antdv.com/components/form-cn/#Form-Item) | - | - |
| rules | 检验表单的规则[参考](https://www.antdv.com/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99) | - | - |

```jsx
formState = {
    name: 'zs',
    age: 20,
    name1: 2,
    time: '',
    RangePicker: []
};
formList = [
    {
        type: RangePicker, // 注意这里需要从组件库引入
        field: 'RangePicker',
        label: '时间',
        placeholder: ['左边', '右边'],
        allowClear: true
    },
    {
        type: Input,
        field: 'name',
        label: '姓名',
        placeholder: 'input placeholder',
        allowClear: true
    },
    {
        type: Input,
        field: 'age',
        label: '年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄'
    }
];
```

| 方法     | 说明                     | 类型 | 默认值 |
| -------- | ------------------------ | ---- | ------ |
| onSubmit | 校验通过后的收集到的数据 | -    | -      |
