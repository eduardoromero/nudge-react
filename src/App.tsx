import './App.css';
import { useReducer, useState } from 'react';
import classNames from 'classnames';
import { GameActivity } from './shared/GameActivity';
import { generateRandomItem } from './shared/utils';
import Queue from './components/queue';

type QueueEvent = {
    type: 'queued' | 'dequeued';
    item?: any;
};

function QueueItemEventHandler(items: GameActivity[], event: QueueEvent): GameActivity[] {
    switch (event.type) {
        case 'queued':
            console.log(`Enqueueing item`);
            return [...items, generateRandomItem()];
        case 'dequeued':
            console.log(`Dequeueing item`);
            const result = items.slice();
            const item = result.shift();
            if (item) {
                console.log(`removed item: ${item.id}`);
            }

            return result;
        default:
            console.log(`Unknown event: ${event}`);

            return items;
    }
}

const initialState: GameActivity[] = [];

let timer;

function App() {
    const [intervalToggle, toggleInterval] = useState(false);
    const [items, dispatch] = useReducer(QueueItemEventHandler, initialState);

    return (
        <div id="App">
            <div id="holder">
                <button
                    id="generate"
                    onClick={() => dispatch({ type: 'queued' })}
                    disabled={items.length >= 10}
                    className={classNames({
                        disabled: items.length >= 10
                    })}
                >
                    Click!
                </button>
                &nbsp;
                <button
                    onClick={() => {
                        if (!intervalToggle) {
                            timer = setInterval(() => {
                                console.log(`Tick!`);

                                dispatch({ type: 'dequeued' });
                            }, 500);
                        } else {
                            clearInterval(timer);
                        }

                        toggleInterval(!intervalToggle);
                    }}
                >
                    {!intervalToggle ? 'Start' : 'Stop'} Consumer
                </button>
            </div>
            <div id="grid">
                <Queue items={items} />
            </div>
        </div>
    );
}

export default App;
