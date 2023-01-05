import { useEventEmitter } from 'ahooks';
import classNames from 'classnames';
import { useEffect, useReducer, useState } from 'react';
import { clearInterval } from 'timers';
import './App.css';
import Intro from './components/Intro';
import Queue from './components/Queue';
import { GameActivity } from './shared/GameActivity';
import { SimpleNudgingStore } from './shared/NudgingQueueStore';
import { QueueEvent } from './shared/QueueEvent';
import { generateRandomItem } from './shared/utils';

type SimpleNudgingStoreState = {
    store: SimpleNudgingStore;
    nudges: number;
    item?: GameActivity;
};

function QueueItemEventHandler(state: SimpleNudgingStoreState, event: QueueEvent): SimpleNudgingStoreState {
    const { item } = event;
    const { nudges, store } = state;

    switch (event.type) {
        case 'queued':
            // no-op
            if (!item || store.getActivities().includes(item)) {
                return state;
            }

            const new_store = new SimpleNudgingStore(store.getActivities());
            console.log(`Enqueueing item`);
            new_store.push(item);

            let nudged = 0;
            if (new_store.getNudges()) {
                nudged = 1;
                item.triggeredNudge = true;
            }

            return { store: new_store, nudges: nudges + nudged, item };
        case 'dequeued':
            console.log(`Dequeueing item`);

            const removed = store.getActivity();
            if (removed) {
                console.log(`removed item: ${removed.id}`);
            }

            return { store: new SimpleNudgingStore(store.getActivities()), nudges, item: removed };
        default:
            console.log(`Unknown event: ${event}`);

            return { store, nudges, item };
    }
}

// NodeJS.Timers is not available on browsers, using "any" instead.
const initialTimers: any[] = [];
const initial: SimpleNudgingStoreState = {
    store: new SimpleNudgingStore(),
    nudges: 0,
    item: undefined
};
const seenInitialState = new Set<GameActivity>();

function App() {
    const [total, updateTotalCounter] = useState(0);
    const [intervalToggle, toggleInterval] = useState(false);
    const [timers, updateTimers] = useState(initialTimers);
    const [state, dispatch] = useReducer(QueueItemEventHandler, initial);
    const [seen, trackSeenItems] = useState(seenInitialState);

    const { nudges, item } = state;
    const percentage = total === 0 ? 0 : Math.round((nudges / total) * 100);
    const event$ = useEventEmitter<QueueEvent>();

    useEffect(() => {
        if (item && item.id !== '' && !seen.has(item)) {
            // trigger only once
            trackSeenItems(new Set([...seen, item]));

            const { triggeredNudge = false } = item || {};
            if (triggeredNudge) {
                event$.emit({ type: 'nudged', item });
            }
        }
    }, [item]);

    return (
        <div id="App">
            <div className="intro">
                <h2>Intro</h2>
                <p>
                    Nudging is a scheduling algorithm for Queueing. It's intuitively simple and improves time in queue for light-tailed
                    queues compared with First-Come First-Served (FIFO) while still preserving fairness.{' '}
                </p>
            </div>
            <div id="holder">
                <button
                    id="generate"
                    onClick={() => {
                        const item = generateRandomItem();
                        const event: QueueEvent = { type: 'queued', item };

                        dispatch(event);
                        event$.emit(event);

                        updateTotalCounter(total + 1);
                    }}
                    disabled={state.store.length() >= 10}
                    className={classNames({
                        disabled: state.store.length() >= 10
                    })}
                >
                    Add a job!
                </button>
                &nbsp;
                <button
                    id="dequeue"
                    onClick={() => {
                        const event: QueueEvent = { type: 'dequeued', item: undefined };
                        dispatch(event);
                        event$.emit(event);
                    }}
                    disabled={state.store.length() < 1}
                    className={classNames({
                        disabled: state.store.length() < 1
                    })}
                >
                    Dequeue!
                </button>
                &nbsp;
                <button
                    onClick={() => {
                        if (!intervalToggle) {
                            const timer = setInterval(() => {
                                console.log(`Tick!`);

                                const event: QueueEvent = { type: 'dequeued', item: undefined };
                                dispatch(event);
                                event$.emit(event);
                            }, 500);

                            updateTimers([...timers, timer]);
                        } else {
                            timers.forEach((timer) => clearInterval(timer));

                            updateTimers([]);
                        }

                        toggleInterval(!intervalToggle);
                    }}
                >
                    {!intervalToggle ? 'Start' : 'Stop'} Consumer
                </button>
            </div>
            <div id="grid">
                <Queue items={state.store.getActivities()} emitter={event$} />
            </div>
            <div>
                Nudged <strong>{nudges}</strong> times so far out of <strong>{total}</strong> jobs, that's about
                <strong> {percentage}%</strong> of all jobs.
            </div>
            <Intro />
        </div>
    );
}

export default App;
