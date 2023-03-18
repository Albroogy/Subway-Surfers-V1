import SaveGameSystem, { SaveKey } from "./saveGameSystem";

enum AchievementName {
    GoldCollector = "Gold Collector",
    GoldHorder = "Gold Horder",
    GoldMonger = "Gold Monger",
    Apprentice = "Apprentice",
    Warrior = "Master Warrior",
    Sensei = "Sensei",
}

enum ValueType {
    Gold = "gold",
    EnemiesDefeated = "enemiesDefeated"
}

export interface AchievementInfo {
    name: AchievementName;
    description: string;
    isUnlocked: boolean;
    valueType: ValueType;
    requisite: number
  }
  
export default class AchievementSystem {
    public static Instance = new AchievementSystem();
    private _achievements: AchievementInfo[];
  
    constructor() {
        if (SaveGameSystem.Instance.loadData(SaveKey.AchievementInfo)){
            this._achievements = SaveGameSystem.Instance.loadData(SaveKey.AchievementInfo)!;
            console.log(SaveGameSystem.Instance.loadData(SaveKey.AchievementInfo));
        }
        else {
            this._achievements = [
                {
                    name: AchievementName.GoldCollector,
                    description: "Collect 100 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.Gold,
                    requisite: 100
                },
                {
                    name: AchievementName.GoldHorder,
                    description: "Collect 300 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.Gold,
                    requisite: 300
                },
                {
                    name: AchievementName.GoldMonger,
                    description: "Collect 500 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.Gold,
                    requisite: 500
                },
                {
                    name: AchievementName.Apprentice,
                    description: "Defeat 10 enemies",
                    isUnlocked: false,
                    valueType: ValueType.EnemiesDefeated,
                    requisite: 10
                },
                {
                    name: AchievementName.Warrior,
                    description: "Defeat 100 enemies",
                    isUnlocked: false,
                    valueType: ValueType.EnemiesDefeated,
                    requisite: 100
                },
                {
                    name: AchievementName.Sensei,
                    description: "Collect 300 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.EnemiesDefeated,
                    requisite: 300
                },
            ];
        }
    }
    public checkAchievements(gold: number, enemiesDefeated: number) {
        const achievementsLeft = this.getLockedAchievements();
        for (const achievement of achievementsLeft){
            if (achievement.valueType == ValueType.Gold){
                this.checkAchievementAccomplishedFunction(gold, achievement.name, achievement.requisite);
            }
            if (achievement.valueType == ValueType.EnemiesDefeated){
                this.checkAchievementAccomplishedFunction(gold, achievement.name, achievement.requisite);
            }
        }
    }
    public checkAchievementAccomplishedFunction(value: number, name: AchievementName, requisite: number) {
        if (value >= requisite){
            AchievementSystem.Instance.unlockAchievement(name);
        }
    }
    public unlockAchievement(name: AchievementName): void {
        const achievement = this._achievements.find(a => a.name === name);
        if (achievement && !achievement.isUnlocked) {
            achievement.isUnlocked = true;
            console.log(`Achievement unlocked: ${achievement.name}`);
        }
    }
    public getLockedAchievements(): AchievementInfo[] {
        return this._achievements.filter(a => !a.isUnlocked);
    }
    public getUnlockedAchievements(): AchievementInfo[] {
        return this._achievements.filter(a => a.isUnlocked);
    }
    public drawAchievements() {
        
    }
    public get AchievementInfo(): AchievementInfo[] {
        return this._achievements;
    }
}  
