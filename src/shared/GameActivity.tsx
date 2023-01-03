export enum GameSize {
    SMALL = 'SMALL',
    BIG = 'BIG'
}

export type GameActivity = {
    size: GameSize;
    id: string;
    created: Date;
    color: string;
    nudged: boolean;
};
