import classNames from 'classnames';
import { GameActivity, GameSize } from '../shared/GameActivity';
import { AnimatePresence, motion, useAnimationControls, Variant } from 'framer-motion';
import { ulid } from 'ulidx';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import { QueueEvent } from '../shared/QueueEvent';

const EMPTY_VALUE = Symbol('EmptyQueueItem');

const EmptyItem: GameActivity = {
    id: EMPTY_VALUE,
    color: '',
    created: new Date(),
    nudged: false,
    triggeredNudge: false,
    size: GameSize.BIG
};

function EmptyQueueItem() {
    return <div className="item empty" key={ulid()}></div>;
}

function QueueItem(item: GameActivity) {
    if (item.id == EMPTY_VALUE) {
        return EmptyQueueItem();
    }

    const s = `${item.created.getSeconds()}`.padStart(2, '0');
    const m = `${item.created.getMinutes()}`.padStart(2, '0');
    const ms = `${item.created.getMilliseconds()}`.padStart(3, '0');
    const isBig = GameSize.BIG === item.size;
    const height = isBig ? 200 : 150;
    const marginTop = isBig ? -40 : 10;

    return (
        <AnimatePresence key={`animate` + item.id}>
            <motion.div
                key={item.id.toString()}
                className={classNames('item', { big: GameSize.BIG === item.size }, { nudged: item.nudged })}
                style={{ backgroundColor: item.color }}
                initial={{ opacity: 0, height: 100, marginTop: 10, x: -10 }}
                animate={{ opacity: 1, height, marginTop, x: 0 }}
                exit={{ opacity: 0, height: 100, x: 10 }}
            >
                {m}:{s}:{ms}
            </motion.div>
        </AnimatePresence>
    );
}

function getInReverseOrder<Type>(items: Type[]): Type[] {
    const result = [];

    for (let i = items.length; i > 0; i--) {
        result.push(items[i - 1]);
    }

    return result;
}

type QueueProps = {
    items: GameActivity[];
    emitter: EventEmitter<QueueEvent>;
};

const variants: { [key: string]: Variant } = {
    on: {
        borderColor: 'green',
        transition: {
            duration: 0.5
        }
    },
    dequeued: {
        borderColor: '#8ecae6',
        transition: {
            duration: 0.5
        }
    },
    nudged: {
        borderColor: 'blue',
        transition: {
            duration: 0.5
        }
    },
    off: {
        borderColor: 'black',
        transition: {
            delay: 0.25
        }
    },
    hidden: {
        pathLength: 0,
        opacity: 0,
        transition: {
            delay: 0.01
        }
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { type: 'inertia', duration: 0.01, bounce: 0 },
            opacity: { duration: 0.01 }
        }
    },
    normal: {
        borderColor: 'azure',
        transition: {
            delay: 0.25
        }
    }
};

export default function Queue(props: QueueProps) {
    const { items, emitter } = props;
    const reversed = getInReverseOrder(items);

    const headControls = useAnimationControls();
    const tailControls = useAnimationControls();

    // pad the array with empty values so the animation looks better
    const padded = [...reversed, ...Array(10 - reversed.length).fill(EmptyItem)];

    emitter.useSubscription(async (event) => {
        switch (event.type) {
            case 'nudged':
                await headControls.start('nudged');
                await headControls.start('off');
                return;
            case 'queued':
                const play = headControls.start('visible');
                const border = headControls.start('on');
                await Promise.all([border, play]);
                // animate queued
                await headControls.start('off');
                await headControls.start('hidden');

                return;
            case 'dequeued':
                if (items.length) {
                    // animate dequeued
                    const border = tailControls.start('dequeued');
                    const x = tailControls.start('visible');
                    await Promise.all([border, x]);
                    await tailControls.start('normal');
                    await tailControls.start('hidden');
                    return;
                }
        }
    });

    return (
        <>
            <motion.div animate={headControls} variants={variants} className={'item head'}>
                <motion.svg width="80" height="150" viewBox="0 0 80 150" variants={variants} initial="hidden" animate={headControls}>
                    <motion.line x1="30" y1="55" x2="55" y2="75" stroke="black" />
                    <motion.line x1="30" y1="100" x2="55" y2="75" stroke="black" />
                </motion.svg>
            </motion.div>
            {padded.map((i: any) => QueueItem(i))}
            <motion.div animate={tailControls} variants={variants} className={'item tail'}>
                <motion.svg width="80" height="150" viewBox="0 0 80 150" variants={variants} initial="hidden" animate={tailControls}>
                    <motion.line x1="20" y1="55" x2="60" y2="100" stroke="#219ebc" />
                    <motion.line x1="20" y1="100" x2="60" y2="55" stroke="#219ebc" />
                </motion.svg>
            </motion.div>
        </>
    );
}
