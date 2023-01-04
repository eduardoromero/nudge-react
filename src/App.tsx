import './App.css';
import { useReducer, useState } from 'react';
import classNames from 'classnames';
import { generateRandomItem } from './shared/utils';
import Queue from './components/Queue';
import { SimpleNudgingStore } from './shared/NudgingQueueStore';
import { GameActivity } from './shared/GameActivity';
import { clearInterval } from 'timers';

type QueueEvent = {
    type: 'queued' | 'dequeued';
    item: GameActivity | undefined;
};

type SimpleNudgingStoreState = {
    store: SimpleNudgingStore;
    nudges: number;
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
            }

            return { store: new_store, nudges: nudges + nudged };
        case 'dequeued':
            console.log(`Dequeueing item`);

            const removed = store.getActivity();
            if (removed) {
                console.log(`removed item: ${removed.id}`);
            }

            return { store: new SimpleNudgingStore(store.getActivities()), nudges };
        default:
            console.log(`Unknown event: ${event}`);

            return { store, nudges };
    }
}

// NodeJS.Timers is not available on browsers, using "any" instead.
const initialTimers: any[] = [];
const initial: SimpleNudgingStoreState = {
    store: new SimpleNudgingStore(),
    nudges: 0
};

function App() {
    const [total, updateTotalCounter] = useState(0);
    const [intervalToggle, toggleInterval] = useState(false);
    const [timers, updateTimers] = useState(initialTimers);
    const [state, dispatch] = useReducer(QueueItemEventHandler, initial);

    const { nudges } = state;
    const percentage = total === 0 ? 0 : Math.round((nudges / total) * 100);

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
                        dispatch({ type: 'queued', item });

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
                        dispatch({ type: 'dequeued', item: undefined });
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

                                dispatch({ type: 'dequeued', item: undefined });
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
                <div className={'item head'}></div>
                <Queue items={state.store.getActivities()} />
                <div className={'item tail'}></div>
            </div>
            <div>
                Nudged <strong>{nudges}</strong> times so far out of <strong>{total}</strong> jobs, that's about
                <strong> {percentage}%</strong> of all jobs.
            </div>
            <div className="intro">
                <h2>Trying it out</h2>
                <ul>
                    <li>
                        Add a job to the queue by clicking the <strong>add</strong> button. The Queue can hold a maximum of 10 jobs.
                    </li>
                    <li>
                        Consume a job by clicking the <strong>dequeue</strong> button.
                    </li>
                    <li>
                        Continue to add jobs. When a job is <span className="nudged">Nudged</span> it swaps places with the new job, and it
                        stays in the last position of the queue.
                    </li>
                    <li>
                        If you want the job consumer can take a way a job every tick. Start it by clicking
                        <strong> start consumer</strong>.
                    </li>
                </ul>

                <h2>How it works</h2>
                <p>
                    When a new job is inserted into the queue, we check if there is any existing job that is going to take longer to
                    process. If there is one, we swap its position with the new job. This process is known as a "nudge." However, we only
                    allow a job to be nudged once to ensure that the algorithm is fast and fair.
                </p>
                <p>
                    There are two type of jobs, small and big. <span className="nudged">Nudged</span> jobs are marked with a dotted line The
                    text on the job it's the "arrival timestamp" (in mm:ss.ms), it makes it easier to confirm when a job is older than
                    another job. Finally, jobs that arrive closely together tend to have similar color, that way, when a job "jumps" over
                    another it kinda looks out of place.
                </p>
                <p>
                    <a href="https://github.com/eduardoromero/nudge-react" target="_blank">
                        Here
                    </a>{' '}
                    is the code and{' '}
                    <a href="https://github.com/eduardoromero/QNudge" target="_blank">
                        here
                    </a>{' '}
                    is a simulation that generates runs with a lot more data (20,000 items) and then prints a summary of the average time in
                    queue for both FCFS and with Nudge.
                </p>
            </div>
        </div>
    );
}

export default App;
