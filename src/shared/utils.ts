import { GameActivity, GameSize } from './GameActivity';
import { ulid } from 'ulidx';

const colors = [
    '#8ecae6',
    '#219ebc',
    '#89AAE6',
    '#ffb703',
    '#fb8500',
    '#2a9d8f',
    '#f4a261',
    '#94d2bd',
    '#a8dadc',
    '#669bbc',
    '#caf0f8',
    '#ffcfd2',
    '#98f5e1',
    '#e9ecef',
    '#ffe5ec',
    '#ff8fab'
];

export function getRandomSize(): GameSize {
    const values = Object.keys(GameSize);
    const k = values[Math.floor(Math.random() * values.length)];

    // @ts-ignore
    return GameSize[k];
}

export function generateRandomItem(): GameActivity {
    const color = generateRandomColor(); // colors[Math.floor(Math.random() * colors.length)];

    const d = new Date();
    return {
        id: ulid(),
        size: getRandomSize(),
        created: d,
        color,
        nudged: false,
        triggeredNudge: false
    };
}

function generateRandomColor(): string {
    const colorIndex = Math.round(new Date().getTime() / 1000) % colors.length;
    const baseColor = colors[colorIndex];
    const [h, s, l] = hexToHsl(baseColor);
    const newHue = (h + Math.round(Math.random() * 50 - 10)) % 360;
    return hslToHex(newHue, s, l);
}

function hexToHsl(hex: string): [number, number, number] {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16) / 255;
        const g = parseInt(result[2], 16) / 255;
        const b = parseInt(result[3], 16) / 255;
        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h = (max + min) / 2,
            s = (max + min) / 2,
            l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
    return [0, 0, 0];
}

function hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}
