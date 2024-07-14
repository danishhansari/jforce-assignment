const Input = ({ type, name, placeholder, value, className, onChange, disabled = false, defaultValue = "" }) => {
    return (
        <input
            defaultValue={ defaultValue }
            name={ name }
            disabled={ disabled }
            onChange={ onChange }
            className={ `w-full py-3 pl-8 rounded-full focus:border-blue-600 focus:outline-none text-lg bg-gray-700/10 focus:bg-gray-400/10 font-medium ${className} disabled:bg-gray-700/10 disabled:text-black/30` }
            type={ type }
            placeholder={ placeholder }
            value={ value }
        />
    );
};

export default Input;