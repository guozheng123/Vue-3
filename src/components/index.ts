import { App } from 'vue';
import TpfInputNumber from './TpfInputNumber/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import LoadingSkeleton from '@/components/TpfSkeleton/LoadingSkeleton';
import TpfAutoComplete from './TpfAutoComplete';
export * from './commonComponents';
export * from './TpfSubmitForm';
export * from './TpfInput';
export default function useComponents(app: App) {
    app.component('TpfInputNumber', TpfInputNumber);
    app.component('SvgIcon', SvgIcon);
    app.component('LoadingSkeleton', LoadingSkeleton);
    app.component('TpfAutoComplete', TpfAutoComplete);
}
