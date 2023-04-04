import { generateGoblinBoss } from "../entityGenerator";
import { canvas, context, IN_GAME_MINUTE, IN_GAME_SECOND } from "../global";

export default class BossSystem {
    public static Instance = new BossSystem();
    public nextBossTime: number = Date.now() + IN_GAME_MINUTE;
    public nextBossIndex: number = 0;
    public bosses = [BossType.GoblinBoss];

    public checkNextBossSpawn(currentTime: number) {
        if (currentTime > this.nextBossTime){
            this.bosses[this.nextBossIndex];
            this.nextBossIndex += 1;
        }
    }
}

enum BossType {
    GoblinBoss
}

const PowerupTypeGenerator = {
    [BossType.GoblinBoss]: generateGoblinBoss,
};