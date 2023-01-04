import classNames from 'classnames';
import { GameActivity, GameSize } from '../shared/GameActivity';
import { AnimatePresence, motion } from 'framer-motion';
import { ulid } from 'ulidx';

const EMPTY_VALUE = Symbol('EmptyQueueItem');

const EmptyItem: GameActivity = {
    id: EMPTY_VALUE,
    color: '',
    created: new Date(),
    nudged: false,
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
};

export default function Queue(props: QueueProps) {
    const { items } = props;
    const reversed = getInReverseOrder(items);

    // pad the array with empty values so the animation looks better
    const padded = [...reversed, ...Array(10 - reversed.length).fill(EmptyItem)];

    return <>{padded.map((i: any) => QueueItem(i))}</>;
}
