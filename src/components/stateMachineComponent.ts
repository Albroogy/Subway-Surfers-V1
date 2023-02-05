import { Component, Entity } from "../entityComponent";

type EntityFunctor = (entity: Entity) => void;
type UpdateStateFunctor<StateEnum> = (deltaTime: number, entity: Entity) => StateEnum | undefined;

export class State<StateEnum> {
    public onActivation: EntityFunctor;
    public update: UpdateStateFunctor<StateEnum>;
    public onDeactivation: EntityFunctor;
    constructor(onActivation: EntityFunctor, update: UpdateStateFunctor<StateEnum>, onDeactivation: EntityFunctor) {
        this.onActivation = onActivation;
        this.update = update;
        this.onDeactivation = onDeactivation;
    }
}

export class StateMachine<StateEnum extends string> {
    public states: Record<StateEnum, State<StateEnum>>;
    public activeState: null | State<StateEnum>;
    public data: Record<string, number>;
    constructor() {
        this.states = {} as Record<StateEnum, State<StateEnum>>;
        this.activeState = null;
        this.data = {
            stateStart: 0,
        }
    }
    addState(stateName: StateEnum, onActivation: EntityFunctor, update: UpdateStateFunctor<StateEnum>, onDeactivation: EntityFunctor) {
        this.states[stateName] = new State(onActivation, update, onDeactivation);
    }
    update(deltaTime: number, currentObject: Entity) {
        if (this.activeState){
            const nextState: StateEnum | undefined = this.activeState.update(deltaTime, currentObject);
            // console.log(nextState)
            if (nextState){
                this.activeState.onDeactivation(currentObject);
                this.activeState = this.states[nextState];
                this.activeState.onActivation(currentObject);
            }
        }
    }
}

export default class StateMachineComponent<StateEnum extends string> extends Component {
    public static COMPONENT_ID: string = "StateMachine";
    
    public activate(initialState: StateEnum) {
        console.assert(this._entity != null);
        this.stateMachine.activeState = this.stateMachine.states[initialState];
        this.stateMachine.activeState.onActivation(this._entity!);
    }

    public update(deltaTime: number): void {
        if (this._entity) {
            this.stateMachine.update(deltaTime, this._entity);
        }
    }

    public stateMachine: StateMachine<StateEnum> = new StateMachine<StateEnum>();
}
