import "./Star.scss";

const Star = ({ value = 0 }) => {

    return (
        <div className="stars" aria-label={`Puntaje ${value} de 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <span
            key={i}
            className={`star ${i < value ? "star--on" : ""}`}
            >
            ★
            </span>
        ))}
        </div>
    );
};

export default Star;