import { App } from 'vue';
import permission from './permission';
import dragModal from './dragModal';
import loading from './loading';
import focus from './focus';
import noData from './noData';
import drag from './drag';
import debounce from './debounce';
import ellipsis from './ellipsis';
import inputNumber from './inputNumber';
import loadMore from './loadMore';
import lazyImg from './lazyImg';

export default function useDirectives(app: App) {
    app.directive('permission', permission);
    app.directive('dragModal', dragModal);
    app.directive('loading', loading);
    app.directive('focus', focus);
    app.directive('noData', noData);
    app.directive('drag', drag);
    app.directive('debounce', debounce);
    app.directive('ellipsis', ellipsis);
    app.directive('inputNumber', inputNumber);
    app.directive('loadMore', loadMore);
    app.directive('lazyImg', lazyImg);
}
