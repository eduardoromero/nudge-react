import { GameActivity } from './GameActivity';

export type QueueEvent = {
    type: 'queued' | 'dequeued' | 'nudged';
    item: GameActivity | undefined;
};
