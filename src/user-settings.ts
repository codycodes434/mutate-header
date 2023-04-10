export type Header = {
    name: string;
    value: string;
    isActive: boolean;
}

export type UserSettings = {
    headers: Header[];
    isActive: boolean;
};

export type SavedUserSetting = Record<string, string>;