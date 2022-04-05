export declare type WikiEntry = {
    term: string;
    definitions: string[];
};
export declare const csWiki: WikiEntry[];
export declare const getCSWordOfDay: () => WikiEntry;
export declare const getWikiEntryByTerm: (term: string) => WikiEntry | undefined;
