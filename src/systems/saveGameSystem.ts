export default class SaveGameSystem {
    public static Instance = new SaveGameSystem();

    public saveData<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    public loadData<T>(key: string): T | null {
        const textRepresentation = localStorage.getItem(key);
        if (!textRepresentation) {
            return null;
        }
        return JSON.parse(textRepresentation) as T;
    }
}