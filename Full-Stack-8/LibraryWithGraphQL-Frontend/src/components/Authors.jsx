import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_AUTHORS, SET_BIRTHYEAR } from "./queries";
import Select from "react-select";

const Authors = (props) => {
  // increases network traffic, catches changes made by other users
  //  const result = useQuery(ALL_AUTHORS, { pollInterval: 2000 });
  const result = useQuery(ALL_AUTHORS);

  const [selectedName, setSelectedName] = useState(null);
  const [born, setBorn] = useState(1900);
  const [setBornTo, mutationResult] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
    },
  });

  useEffect(() => {
    if (mutationResult.data && mutationResult.data.editAuthor === null) {
      console.log("author not found");
    }
  }, [mutationResult.data]);

  if (!props.show) {
    return null;
  }

  const setBirthyear = async (event) => {
    event.preventDefault();

    setBornTo({
      variables: { name: selectedName.value, setBornTo: parseInt(born) },
    });

    setBorn(1900);
  };

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const options = authors.map((a) => ({
    value: a.name,
    label: a.name,
  }));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={setBirthyear}>
        <Select
          defaultValue={selectedName}
          onChange={setSelectedName}
          options={options}
        />
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
