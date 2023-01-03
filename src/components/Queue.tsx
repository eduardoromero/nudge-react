import classNames from 'classnames';
import { GameActivity, GameSize } from '../shared/GameActivity';
import { AnimatePresence, motion } from 'framer-motion';

function QueueItem(item: GameActivity) {
    const s = `${item.created.getSeconds()}`.padStart(2, '0');
    const m = `${item.created.getMinutes()}`.padStart(2, '0');
    const ms = `${item.created.getMilliseconds()}`.padStart(3, '0');
    const isBig = GameSize.BIG === item.size;
    const height = isBig ? 200 : 150;
    const marginTop = isBig ? -40 : 10;

    return (
        <AnimatePresence key={`animate` + item.id}>
            <motion.div
                key={item.id}
                className={classNames('item', { big: GameSize.BIG === item.size })}
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

export default function Queue({ items }) {
    const reversed = getInReverseOrder(items);

    return <>{reversed.map((i) => QueueItem(i))}</>;
}
