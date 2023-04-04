import { generateGoblinBoss } from "../entityGenerator";
import { calculateLaneLocation, canvas, context, IN_GAME_MINUTE, IN_GAME_SECOND } from "../global";

export default class BossSystem {
    public static Instance = new BossSystem();
    public nextBossTime: number = Date.now() + IN_GAME_MINUTE;
    public nextBossIndex: number = 0;
    public bosses = [BossType.GoblinBoss];
    public bossSpawnPoint = {
        x: calculateLaneLocation(2),
        y: 100
    }

    public checkNextBossSpawn(currentTime: number) {
        if (currentTime > this.nextBossTime){
            PowerupTypeGenerator[this.bosses[this.nextBossIndex]](calculateLaneLocation(2), 100);
            this.nextBossIndex += 1;
            this.nextBossTime += IN_GAME_MINUTE;
        }
    }
}

enum BossType {
    GoblinBoss
}

const PowerupTypeGenerator = {
    [BossType.GoblinBoss]: generateGoblinBoss,
};