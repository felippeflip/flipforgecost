export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-none border border-transparent bg-[#CCFF00] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#09090b] transition duration-150 ease-in-out hover:bg-[#b3e600] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:ring-offset-2 active:bg-[#99c200] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
