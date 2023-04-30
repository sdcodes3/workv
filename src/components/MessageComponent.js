export default function MessageComponent({ user }) {
    console.log(user);
    return (
        <div
            className={`d-flex ${
            user === 1 ? "justify-content-end" : "justify-content-start"
            }`}
        >
            <div className={`p-2 m-2 bg-primary w-50`}>vignesh</div>
        </div>
    );
}