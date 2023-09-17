import type { ReduxState } from '@assets/redux';

const selectLanguage = (state: ReduxState) => state.language;

export { selectLanguage };
