const getTpfLoading = () => document.getElementById('tpf-loading') as HTMLDivElement;
export const closeGlobalLoading = () => {
    getTpfLoading().style.display = 'none';
};
export const openGlobalLoading = () => {
    getTpfLoading().style.display = 'unset';
};
