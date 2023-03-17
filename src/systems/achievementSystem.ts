type RequirementCheck = (value: number, name: AchievementName) => void;

interface AchievementInfo {
    name: AchievementName;
    description: string;
    isUnlocked: boolean;
    valueType: string
    requirementCheck: RequirementCheck
  }
  
export default class AchievementSystem {
    public static instance = new AchievementSystem();
    private achievements: AchievementInfo[];
  
    constructor() {
        this.achievements = [
        {
            name: AchievementName.GoldCollector,
            description: "Collect 100 pieces of gold",
            isUnlocked: false,
            valueType: ValueType.Gold,
            requirementCheck: checkGoldOver100
        },
        {
            name: AchievementName.GoldHorder,
            description: "Collect 300 pieces of gold",
            isUnlocked: false,
            valueType: ValueType.Gold,
            requirementCheck: checkGoldOver300
        },
        {
            name: AchievementName.GoldMonger,
            description: "Collect 500 pieces of gold",
            isUnlocked: false,
            valueType: ValueType.Gold,
            requirementCheck: checkGoldOver500
        },
        ];
    }
    public checkAchievements(gold: number) {
        const achievementsLeft = this.getLockedAchievements();
        for (const achievement of achievementsLeft){
            if (achievement.valueType == ValueType.Gold){
                achievement.requirementCheck(gold, achievement.name);
                console.log(achievement.name);
            }
        }
    }
    public unlockAchievement(name: AchievementName): void {
        const achievement = this.achievements.find(a => a.name === name);
        if (achievement && !achievement.isUnlocked) {
            achievement.isUnlocked = true;
            console.log(`Achievement unlocked: ${achievement.name}`);
        }
    }
    public getLockedAchievements(): AchievementInfo[] {
        return this.achievements.filter(a => !a.isUnlocked);
    }
    public getUnlockedAchievements(): AchievementInfo[] {
        return this.achievements.filter(a => a.isUnlocked);
    }
}  

enum AchievementName {
    GoldCollector = "Gold Collector",
    GoldHorder = "Gold Horder",
    GoldMonger = "Gold Monger",
}

enum ValueType {
    Gold = "gold"
}

function checkGoldOver100 (gold: number, name: AchievementName): void {
    if (gold >= 1){
        AchievementSystem.instance.unlockAchievement(name);
    }
}
function checkGoldOver300 (gold: number, name: AchievementName): void {
    if (gold >= 300){
        AchievementSystem.instance.unlockAchievement(name);
    }
}
function checkGoldOver500 (gold: number, name: AchievementName): void {
    if (gold >= 500){
        AchievementSystem.instance.unlockAchievement(name);
    }
}