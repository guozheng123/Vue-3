import { onMounted, onUnmounted, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

export const useStopKeyDownEvent = () => {
    const stopEvent = (e: KeyboardEvent) => {
        e.stopPropagation();
    };
    onMounted(() => {
        document.addEventListener('keydown', stopEvent);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', stopEvent);
    });
};

export const useKeyDownArrow = (allQs: string[]) => {
    useStopKeyDownEvent();
    //所有的input列表
    const allIptList = ref<HTMLInputElement[][]>([]);

    //当前focus的序号
    const openComIndex = ref('');

    //修改input 的 focus
    const changeFocusStatus = (colNum: number, rowNum: number) => {
        allIptList.value[rowNum][colNum].focus();
        openComIndex.value = `${colNum}-${rowNum}`;
    };

    // 获取所有的input
    const getAllIptList = (ListLength: number) => {
        const allQsDom = allQs.map(item => {
            return [...document.querySelectorAll(`.${item}`)]?.map((item: any) => {
                return item.querySelector('input') || item;
            });
        });
        allIptList.value = Array.from({ length: ListLength }, (_, inx) => {
            return allQsDom.reduce((t, v) => {
                t.push(v[inx]);
                return t;
            }, []);
        });
    };

    // 键盘的上下左右箭头事件
    const keydownAction = (
        k: string,
        colNum: number,
        rowNum: number,
        ListLength: number, //可以聚焦的列数（不可断开）从0 开始计算
        fieldNum: number
    ) => {
        // console.log('rowNum:列数 ', rowNum);
        // console.log('colNum:行数', colNum);
        if (k === 'ArrowDown') {
            if (rowNum === ListLength - 1) {
                changeFocusStatus(colNum, rowNum);
                return;
            }
            changeFocusStatus(colNum, rowNum + 1);
        }
        if (k === 'ArrowUp') {
            if (rowNum === 0) {
                changeFocusStatus(colNum, rowNum);
                return;
            }
            changeFocusStatus(colNum, rowNum - 1);
        }
        if (k === 'ArrowRight') {
            if (colNum === fieldNum) {
                changeFocusStatus(colNum, rowNum);
                return;
            }
            changeFocusStatus(colNum + 1, rowNum);
        }
        if (k === 'ArrowLeft') {
            if (colNum === 0) {
                changeFocusStatus(colNum, rowNum);
                return;
            }
            changeFocusStatus(colNum - 1, rowNum);
        }
    };
    const tableInstance = ref(null);

    // onClickOutside(tableInstance, () => {
    //     openComIndex.value = '';
    // });

    type PropsEvent = {
        index: number; //当前字段所属顺序， 从0 开始
        listLen: number; // 数据源的函数
        colNum: number; // 第几列
        colLen: number; // 每一行输入框的个数从0 开始
    };
    const handleInputEvent = ({ index, listLen, colNum, colLen }: PropsEvent) => {
        return {
            onKeydown: (e: KeyboardEvent) => {
                e.stopPropagation();
                keydownAction(e.key, colNum, index, listLen, colLen);
            },
            onFocus: () => {
                openComIndex.value = `${colNum}-${index}`;
            }
        };
    };

    return {
        tableInstance,
        allIptList,
        openComIndex,
        getAllIptList,
        keydownAction,
        handleInputEvent
    };
};
