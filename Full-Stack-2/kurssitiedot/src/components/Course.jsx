const Course = (props) => {
    return (
      <div>
        <CourseHeader name={props.name}/>
        <Content parts={props.parts}/>
        <Total parts={props.parts}/>
      </div>
    )
}
  
 
const CourseHeader = ({name}) => {
    return (
      <h2>{name}</h2>
    )
}
  
const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
      </div>
    )
}
  
const Part = (props) => {
    return (
      <p>{props.name} {props.exercises}</p>
    )
}
  
const Total = ({parts}) => {
    const total = parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)

    return (
        <p><b>total of {total} exercises</b></p>
    )
}

export default Course

