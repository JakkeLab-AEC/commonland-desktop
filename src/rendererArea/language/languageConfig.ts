export type LocaleCodes = 'en'|'kr'|'jp';

export interface LanguageDisplayItem {
    componentName: string,
    localeCode: LocaleCodes,
    itemName: string;
    displayString: string;
}

export interface LanguageConfig {
    localeCode: LocaleCodes,
    displayStrings: Map<string, LanguageDisplayItem>
}

export const displayStringsGlobal: Map<string, LanguageDisplayItem> = new Map([
    // Boring editor page
    ['BoringManager-pageHeader-kr', {componentName: 'BoringEditor', localeCode:'kr', itemName:'pageHeader', displayString: '시추공 편집'}],
    ['BoringManager-pageHeader-en', {componentName: 'BoringEditor', localeCode:'en', itemName:'pageHeader', displayString: 'Boring Manager'}],
    ['BoringManager-pageHeader-jp', {componentName: 'BoringEditor', localeCode:'jp', itemName:'pageHeader', displayString: 'ボアホール編集'}],

    ['BoringManager-boringList-kr', {componentName: 'BoringEditor', localeCode:'kr', itemName:'boringList', displayString: '시추공 리스트'}],
    ['BoringManager-boringList-en', {componentName: 'BoringEditor', localeCode:'en', itemName:'boringList', displayString: 'Boring List'}],
    
    ['BoringEditor-editorHeader-kr', {componentName: 'BoringEditor', localeCode:'kr', itemName:'editorHeader', displayString: '시추공 편집'}],
    ['BoringEditor-boringNameHeader-kr', {componentName: 'BoringEditor', localeCode:'kr', itemName:'boringNameHeader', displayString: '시추공 이름'}],

    ['BoringEditor-boringCoordinate-kr', {componentName: 'BoringEditor', localeCode:'en', itemName:'boringCoordinate', displayString: '좌표'}],

]);