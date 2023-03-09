export default function SplitBackground(direction, to, from, percent) {

    return `linear-gradient(
        to ${direction},
        ${to} 0%,
        ${to} ${percent}%,
        ${from} ${percent}%,
        ${from} 100%
    )`
}