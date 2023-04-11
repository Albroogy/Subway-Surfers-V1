import { canvas, context } from "../global";
import SaveGameSystem, { SaveKey } from "./saveGameSystem";

enum AchievementName {
    GoldCollector = "Gold Collector",
    GoldHorder = "Gold Horder",
    GoldMonger = "Gold Monger",
    Apprentice = "Apprentice",
    Warrior = "Master Warrior",
    Sensei = "Sensei",
    GoblinBossDefeated = "GoblinBossDefeated",
    GolemBossDefeated = "GolemBossDefeated",
    ItemCollector = "ItemCollector",
    ItemHorder = "ItemHorder",
    ItemMonger = "ItemMonger"
}


export enum ValueType {
    Gold = "gold",
    EnemiesDefeated = "enemiesDefeated",
    GoblinBossDefeated = "GoblinBossDefeated",
    GolemBossDefeated = "GolemBossDefeated",
    Item = "Item"
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
                    description: "Defeat 300 enemies",
                    isUnlocked: false,
                    valueType: ValueType.EnemiesDefeated,
                    requisite: 300
                },
                {
                    name: AchievementName.ItemCollector,
                    description: "Collect 8 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.Item,
                    requisite: 8
                },
                {
                    name: AchievementName.ItemHorder,
                    description: "Collect 16 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.Item,
                    requisite: 16
                },
                {
                    name: AchievementName.ItemMonger,
                    description: "Collect 24 pieces of gold",
                    isUnlocked: false,
                    valueType: ValueType.Item,
                    requisite: 24
                },
                {
                    name: AchievementName.GoblinBossDefeated,
                    description: "Goblin boss defeated",
                    isUnlocked: false,
                    valueType: ValueType.GoblinBossDefeated,
                    requisite: 1
                },
                {
                    name: AchievementName.GolemBossDefeated,
                    description: "Golem boss defeated",
                    isUnlocked: false,
                    valueType: ValueType.GolemBossDefeated,
                    requisite: 1
                },
            ];
        }
    }

    public checkAchievements(gold: number, enemiesDefeated: number, bossesDefeated: BossAchievements, itemsCount: number) {
        const achievementsLeft = this.getLockedAchievements();
        for (const achievement of achievementsLeft){
            switch (achievement.valueType) {
                case ValueType.Gold:
                    this.checkAchievementAccomplishedFunction(gold, achievement.name, achievement.requisite);
                    break;
                case ValueType.EnemiesDefeated:
                    this.checkAchievementAccomplishedFunction(enemiesDefeated, achievement.name, achievement.requisite);
                    break;
                case ValueType.GoblinBossDefeated:
                    this.checkAchievementAccomplishedFunction(bossesDefeated[ValueType.GoblinBossDefeated], achievement.name, achievement.requisite);
                    break;
                case ValueType.GolemBossDefeated:
                    this.checkAchievementAccomplishedFunction(bossesDefeated[ValueType.GolemBossDefeated], achievement.name, achievement.requisite);
                    break;
                case ValueType.Item:
                    this.checkAchievementAccomplishedFunction(itemsCount, achievement.name, achievement.requisite);
                    break;
                default:
                    break;
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
        const width = canvas.width/this._achievements.length;
        const height = canvas.width/this._achievements.length;
        let x = width/2;
        let y = height/2;
        for (const achievement of this._achievements) {
            this.drawSingleAchievement(achievement, x, y, width, height);
            if (x < canvas.width - width * 1.5) {
                x += width;
            }
            else {
                x = width/2;
                y += height;
            }
        }
    }
    public drawSingleAchievement(achievement: AchievementInfo, x: number, y: number, width: number, height: number) {
        context.fillStyle = "gray";
        context.fillRect(x - width/2, y - height/2, width, height);
        context.strokeStyle = "blue";
        context.lineWidth = 2;
        context.strokeRect(x - width/2, y - height/2, width, height);
        context.fillStyle = "black";
        context.font = "25px Arial";
        context.fillText(achievement.description, x - width/4, y);
        if (achievement.isUnlocked) {
            context.fillStyle = "yellow";
            context.fillText("Completed", x - width/4, y + 50);
        }
    }
    public get AchievementInfo(): AchievementInfo[] {
        return this._achievements;
    }
}  

export type BossAchievements = {
    [key: string]: number;
}