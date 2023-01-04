import { GameActivity, GameSize } from './GameActivity';

export interface GameActivityStore {
    readonly name: string;
    readonly short: string;
    length(): number;
    push(activity: GameActivity): void;
    getActivities(): GameActivity[];
    getActivitiesResult(): GameActivity[];
    getActivity(): GameActivity | undefined;
    getNudges(): number | undefined;
}

export class SimpleNudgingStore implements GameActivityStore {
    public readonly name = 'SimpleNudgingStore';
    public readonly short = 'nudge';
    private readonly activities: GameActivity[] = [];
    private result: GameActivity[] = [];
    private nudges = 0;
    private sizes = Object.keys(GameSize);

    constructor(activities: GameActivity[] = []) {
        this.activities = activities;
    }

    public push(activity: GameActivity) {
        console.log(`adding item: ${activity.id} total: ${this.activities.length}`);

        const last = this.activities[this.activities.length - 1];
        if (!last) {
            this.activities.push(activity);
            return;
        }

        const last_size = this.sizes.indexOf(last.size);
        const activity_size = this.sizes.indexOf(activity.size);

        if (last && !last.nudged && activity_size < last_size) {
            this.nudges++;

            // we can only nudge once
            last.nudged = true;

            console.log(`> Nudging ${activity.id} over ${last.id} (total nudges: ${this.nudges})`);

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

    public getActivities(): GameActivity[] {
        return this.activities;
    }

    public getActivitiesResult(): GameActivity[] {
        return this.result;
    }

    public peek() {
        return this.activities[this.length() - 1];
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
