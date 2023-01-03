import { GameActivity } from './GameActivity';

export interface GameActivityStore {
    readonly name: string;
    readonly short: string;
    length(): number;
    push(activity: GameActivity): void;
    getActivitiesResult(): GameActivity[];
    getActivity(): GameActivity | undefined;
    getNudges(): number | undefined;
}

export class SimpleNudgingStore implements GameActivityStore {
    public readonly name = 'SimpleNudgingStore';
    public readonly short = 'nudge';
    private activities: GameActivity[] = [];
    private result: GameActivity[] = [];
    private nudges = 0;

    public push(activity: GameActivity) {
        const last = this.activities[this.activities.length - 1];
        if (last && !last.nudged && activity.size < last.size) {
            this.nudges++;

            // we can only nudge once
            last.nudged = true;

            console.log(`> Nudging ${activity.id} over ${last.id}`);

            // nudge
            this.activities[this.activities.length - 1] = activity;
            this.activities.push(last);
        } else {
            this.activities.push(activity);
        }
    }

    public length(): number {
        return this.activities.length;
    }

    public getActivitiesResult(): GameActivity[] {
        return this.result;
    }

    getNudges(): number {
        return this.nudges;
    }

    getActivity(): GameActivity | undefined {
        const activity = this.activities.shift();
        // push a reference to the results
        if (activity) {
            this.result.push(activity);
        }

        return activity;
    }
}
