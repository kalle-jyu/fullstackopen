import Part from './Part'

const Content = (props) => {
    console.log(props.parts)
    return (
        <div>
            {props.parts.map(part =>
                <Part key={props.courseid + '-' +part.id}
                    courseid={props.courseid}
                    part={part.name}
                    exercises={part.exercises}
                />)}
        </div>
    )
}


export default Content