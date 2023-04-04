import { AnimatedComponent } from "./components/animatedComponent";
import ArrowComponent from "./components/arrowComponent";
import DragonComponent, { DragonAnimationInfo, DragonSound } from "./components/dragonComponent";
import FrankensteinComponent, { FrankensteinAnimationInfo } from "./components/frankensteinComponent";
import GhostComponent, { GhostAnimationInfo } from "./components/ghost";
import GoblinBossComponent, { GoblinBossAnimationInfo } from "./components/goblinBossComponent";
import { ImageComponent } from "./components/imageComponent";
import MinotaurComponent, { MinotaurAnimationInfo } from "./components/minotaurComponent";
import MovementComponent from "./components/movementComponent";
import { player } from "./components/playerComponent";
import PositionComponent from "./components/positionComponent";
import SkeletonComponent, { SkeletonAnimationInfo } from "./components/skeletonComponent";
import { SoundComponent } from "./components/soundComponent";
import StateMachineComponent from "./components/stateMachineComponent";
import { TagComponent } from "./components/tagComponent";
import { Entity } from "./entityComponent";
import { EntityName, mouse, OFFSET, Tag } from "./global";
import { objects } from "./objects";

const OBJECT: Record <string, number> = {
    WIDTH: 50,
    HEIGHT: 50,
    SPAWN_LOCATION: -50
}

export function generateCoin(objectLaneLocation: number, fallSpeed: number){
    const coin: Entity = new Entity(EntityName.Coin);
    coin.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    coin.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("assets/images/coin.png"));
    coin.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    coin.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Coin, Tag.Powerup]));

    objects.push(
        coin
    )
}

export function generateExtendedVision(objectLaneLocation: number, fallSpeed: number){
    const extendedVisionPowerup: Entity = new Entity("ExtendedVisionPowerup");
    extendedVisionPowerup.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    extendedVisionPowerup.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("assets/images/extendedVisionPowerup.png"));
    extendedVisionPowerup.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    extendedVisionPowerup.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.ExtendedVisionPowerup, Tag.Powerup]));

    objects.push(
        extendedVisionPowerup
    )
}


export function generateAura(objectLaneLocation: number, fallSpeed: number){
    const positionComponent = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;

    const auraPowerup: Entity = new Entity("ExtendedVisionPowerup");
    auraPowerup.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, positionComponent.width, positionComponent.height, 0));
    auraPowerup.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("assets/images/aura.png"));
    auraPowerup.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    auraPowerup.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.AuraPowerup, Tag.Powerup]));

    objects.push(
        auraPowerup
    )
}

export function generateDeathStar(objectLaneLocation: number, fallSpeed: number){
    const deathStarPowerup: Entity = new Entity("ExtendedVisionPowerup");
    deathStarPowerup.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT + OFFSET * 10, 0));
    deathStarPowerup.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent("assets/images/deathStar.png"));
    deathStarPowerup.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    deathStarPowerup.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.DeathStarPowerup, Tag.Powerup]));

    objects.push(
        deathStarPowerup
    )
}

export function generateDragon(objectLaneLocation: number, fallSpeed: number){
    const DragonAudio = {
        [DragonSound.Roar]: new Audio('assets/audio/dragon-roar.mp3')
    }

    const dragon: Entity = new Entity(EntityName.Dragon);
    dragon.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, OBJECT.WIDTH, OBJECT.HEIGHT, 0));
    dragon.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/dragon.png", DragonAnimationInfo));
    dragon.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    dragon.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    dragon.addComponent(DragonComponent.COMPONENT_ID, new DragonComponent());
    dragon.addComponent(SoundComponent.COMPONENT_ID, new SoundComponent(DragonAudio));
    dragon.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Dragon, Tag.Enemy]));

    objects.push(
        dragon
    )
}

export function generateMinotaur(objectLaneLocation: number, fallSpeed: number){
    const MINOTAUR_WIDTH: number = 75;
    const MINOTAUR_HEIGHT: number = 75;

    const minotaur: Entity = new Entity(EntityName.Minotaur);
    minotaur.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, MINOTAUR_WIDTH, MINOTAUR_HEIGHT, 0));
    minotaur.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/minotaur.png", MinotaurAnimationInfo));
    minotaur.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    minotaur.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    minotaur.addComponent(MinotaurComponent.COMPONENT_ID, new MinotaurComponent());
    minotaur.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Minotaur, Tag.Enemy]));

    objects.push(
        minotaur
    )
}

export function generateFrankenstein(objectLaneLocation: number, fallSpeed: number){
    const FRANKENSTEIN_WIDTH: number = 100;
    const FRANKENSTEIN_HEIGHT: number = 100;

    const frankenstein: Entity = new Entity(EntityName.Frankenstein);
    frankenstein.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, FRANKENSTEIN_WIDTH, FRANKENSTEIN_HEIGHT, 0));
    frankenstein.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/frankenstein.png", FrankensteinAnimationInfo));
    frankenstein.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    frankenstein.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    frankenstein.addComponent(FrankensteinComponent.COMPONENT_ID, new FrankensteinComponent());
    frankenstein.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Frankenstein, Tag.Enemy]));

    objects.push(
        frankenstein
    )
}

export function generateSkeleton(objectLaneLocation: number, fallSpeed: number){
    const SKELOTON_WIDTH: number = 75;
    const SKELOTON_HEIGHT: number = 75;

    const skeleton: Entity = new Entity(EntityName.Skeleton);
    skeleton.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, SKELOTON_WIDTH, SKELOTON_HEIGHT, 0));
    skeleton.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/skeleton.png", SkeletonAnimationInfo));
    skeleton.addComponent(MovementComponent.COMPONENT_ID, new MovementComponent(fallSpeed, 1));
    skeleton.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    skeleton.addComponent(SkeletonComponent.COMPONENT_ID, new SkeletonComponent());
    skeleton.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Skeleton, Tag.Enemy]));

    objects.push(
        skeleton
    )
}

export function generateGhost(objectLaneLocation: number){
    const GHOST_WIDTH: number = 200;
    const GHOST_HEIGHT: number = 200;

    const ghost: Entity = new Entity(EntityName.Ghost);
    ghost.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, OBJECT.SPAWN_LOCATION, GHOST_WIDTH, GHOST_HEIGHT, 0));
    ghost.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/ghost.png", GhostAnimationInfo));
    ghost.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    ghost.addComponent(GhostComponent.COMPONENT_ID, new GhostComponent());
    ghost.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Ghost, Tag.Enemy]));
    
    objects.push(
        ghost
    )
}

export function generateGoblinBoss(objectLaneLocation: number){
    const GOBLIN_WIDTH: number = 150;
    const GOBLIN_HEIGHT: number = 150;

    const goblin: Entity = new Entity("GoblinBoss");
    goblin.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(objectLaneLocation, 100, GOBLIN_WIDTH, GOBLIN_HEIGHT, 0));
    goblin.addComponent(AnimatedComponent.COMPONENT_ID, new AnimatedComponent("assets/images/goblinBossRight.png", GoblinBossAnimationInfo));
    goblin.addComponent(StateMachineComponent.COMPONENT_ID, new StateMachineComponent());
    goblin.addComponent(GoblinBossComponent.COMPONENT_ID, new GoblinBossComponent());
    goblin.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.GoblinBoss, Tag.Boss, Tag.Enemy]));
    
    objects.push(
        goblin
    )
}

export function generateArrow(positionComponent: PositionComponent){
    const arrow: Entity = new Entity(EntityName.Arrow);

    const ARROW: Record <string, number | string> = {
        WIDTH: 7.5,
        HEIGHT: 45,
        SPEED: 300,
        URL: "assets/images/arrow.png"
    }

    let angle = Math.atan2(mouse.y - positionComponent.y, mouse.x - positionComponent.x);
    const Direction = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    angle += Math.PI / 2;

    arrow.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(positionComponent.x, positionComponent.y, ARROW.WIDTH as number, ARROW.HEIGHT as number, 0, angle));
    arrow.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(ARROW.URL as string));
    arrow.addComponent(ArrowComponent.COMPONENT_ID, new ArrowComponent(ARROW.SPEED as number, Direction));
    arrow.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.Arrow]));

    objects.push(arrow);
}

export function generateMoneyPouch(currentObject: Entity){
    const positionComponent = currentObject.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;
    const playerPositionComponent = player.getComponent<PositionComponent>(PositionComponent.COMPONENT_ID)!;

    const moneyPouch: Entity = new Entity("MoneyPouch");

    const MONEY_POUCH: Record <string, number | string> = {
        WIDTH: 30,
        HEIGHT: 30,
        SPEED: 200,
        URL: "assets/images/moneyPouch.png"
    }

    let angle = Math.atan2(playerPositionComponent!.y - positionComponent.y, playerPositionComponent!.x - positionComponent.x);
    const Direction = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    moneyPouch.addComponent(PositionComponent.COMPONENT_ID, new PositionComponent(positionComponent.x, positionComponent.y, MONEY_POUCH.WIDTH as number, MONEY_POUCH.HEIGHT as number, 0, angle));
    moneyPouch.addComponent(ImageComponent.COMPONENT_ID, new ImageComponent(MONEY_POUCH.URL as string));
    moneyPouch.addComponent(ArrowComponent.COMPONENT_ID, new ArrowComponent(MONEY_POUCH.SPEED as number, Direction));
    moneyPouch.addComponent(TagComponent.COMPONENT_ID, new TagComponent([Tag.MoneyPouch]));

    objects.push(moneyPouch);
}