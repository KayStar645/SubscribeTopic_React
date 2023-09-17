import type { ReduxState } from '@assets/redux';

const selectMenu = (state: ReduxState) => state.menu;

export { selectMenu };
