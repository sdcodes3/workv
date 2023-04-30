export default function MessageComponent({ user }) {
    console.log(user);
    return (
        <div
            className={`d-flex  ${user === 1 ? "justify-content-end " : "justify-content-start "
                }`}
        >
            <div className={`${user === 1 ? "left" : " right"
                } p-2 m-2  w-50 text-center`} >vignesh</div>
        </div>
    );//background: #CDFCF6
}