export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-bold uppercase tracking-widest text-zinc-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
