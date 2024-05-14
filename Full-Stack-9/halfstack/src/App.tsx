const Header = ({ title }: { title: string}) => <h1>{title}</h1>;

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  let info = '';
  let info2 = null;

  switch(coursePart.kind) {
    case 'basic':
      info = coursePart.description;
      break;
    case 'background':
      info = coursePart.description;
      info2 = coursePart.backgroundMaterial;
      break;
    case 'group':
      info = `group projects: ${coursePart.groupProjectCount}`
      break;
    case 'special':
      info = coursePart.description;
      info2 = `required skills${coursePart.requirements.map(r => ` ${r}`)}`;
      break;
    default:
      throw new Error(`Unhandled discriminated union member ${JSON.stringify(coursePart)}`);
  }

  return (
    <div>
    <h3>{ coursePart.name } { coursePart.exerciseCount }</h3>
    <p>{info}</p>
    <p>
        {info !== null && info2}
    </p>
    </div>

  )
}

const Content = ({ courseParts }: { courseParts: CoursePart[]} ) => {
  return (
    <div>
      {courseParts.map(part => <Part key={part.name} coursePart={part}/>)}
    </div>
  )

}

const Total = ({ total }:{ total: number}) => <p>Number of exercises {total}</p>;

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase{
  description: string
}
 
interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[],
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }  
];

const App = () => {
  const courseName = "Half Stack application development";

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
