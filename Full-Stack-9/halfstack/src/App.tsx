interface CoursePartInfo {
  name: string,
  exerciseCount: number
}

const Header = ({ title }: { title: string}) => <h1>{title}</h1>;

const Content = ({ courseParts }: { courseParts: CoursePartInfo[]} ) => {
  return (
    <div>
      {courseParts.map(part => <p key={part.name}>{part.name}{part.exerciseCount}</p>)}
    </div>
  )

}

const Total = ({ total }:{ total: number}) => <p>Number of exercises {total}</p>;

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header title={courseName}/>
      <Content courseParts={courseParts}/>
      <Total total={totalExercises}/>
    </div>
  );
};

export default App;
