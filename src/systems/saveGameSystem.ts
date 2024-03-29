import { Cells, Inventory } from "../components/inventoryComponent";
import AchievementSystem, { AchievementInfo } from "./achievementSystem";

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

    public saveGameData(gold: number, highScore: number, achievementInfo: AchievementInfo[], foundItems: Cells) {
        this.saveData<number>(SaveKey.Gold, gold);
        this.saveData<number>(SaveKey.HighScore, highScore);
        this.saveData<AchievementInfo[]>(SaveKey.AchievementInfo, achievementInfo);
        this.saveData<Cells>(SaveKey.FoundItems, foundItems);
    }
}


export enum SaveKey {
    Gold = "gold",
    HighScore = "highScore",
    AchievementInfo = "achivementInfo",
    FoundItems = "FoundItems"
}

