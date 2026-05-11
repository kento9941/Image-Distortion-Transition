import type { Dispatch, SetStateAction } from "react";

interface ButtonsProps {
    effect: number;
    setEffect: Dispatch<SetStateAction<number>>;
}

const Buttons = ({ effect, setEffect }: ButtonsProps) => {
    return (
        <div className="flex flex-row gap-5 text-[1rem] md:text-[1.5rem] md:gap-10">
            <Button num={0} effect={effect} setEffect={setEffect} />
            <Button num={1} effect={effect} setEffect={setEffect} />
            <Button num={2} effect={effect} setEffect={setEffect} />
        </div>
    )
};

// ---------------------------
// single button
interface ButtonProps {
    num: number;
    effect: number;
    setEffect: Dispatch<SetStateAction<number>>;
}

const Button = ({ num, effect, setEffect }: ButtonProps) => {
    return (
        <button
            onClick={() => setEffect(num)}
            className="cursor-pointer"
            style={{ color: (effect === num) ? "#f0f0f0" : "#999" }}
        >
            Effect {num + 1}
        </button>
    )
};

export default Buttons;
