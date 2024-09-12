const Total = (props) => {
    const total = props.parts.reduce( (s, p) => s + p.exercises, 0)
    console.log(total)
    return (
        <p>
            <strong>
                Total number of exercises {total}
            </strong>
        </p>
    )
}


export default Total