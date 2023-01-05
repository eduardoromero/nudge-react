export enum GameSize {
    SMALL = 'SMALL',
    BIG = 'BIG'
}

export type GameActivity = {
    size: GameSize;
    id: string | Symbol;
    created: Date;
    color: string;
    nudged: boolean;
    triggeredNudge: boolean;
};
