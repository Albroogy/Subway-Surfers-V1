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

    public saveGameData(gold: number, highScore: number) {
        this.saveData<number>(SaveKey.Gold, gold);
        this.saveData<number>(SaveKey.HighScore, highScore);
    }
}

export enum SaveKey {
    Gold = "gold",
    HighScore = "highScore"
}

