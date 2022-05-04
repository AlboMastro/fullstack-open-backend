export const Filter = ({handler}) => {
    return (
        <div>
            Filter numbers with: <input onChange={handler} />
        </div>
    )
}