import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "./queries";
import Select from "react-select";
import BookList from "./BookList";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState({
    value: "All",
    label: "All",
  });

  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  let uniqueGenres = [];
  for (let i = 0; i < books.length; i++) {
    for (let j = 0; j < books[i].genres.length; j++) {
      if (!uniqueGenres.includes(books[i].genres[j])) {
        uniqueGenres.push(books[i].genres[j]);
      }
    }
  }

  uniqueGenres.sort();
  uniqueGenres.unshift("All");

  const options = uniqueGenres.map((ug) => ({
    value: ug,
    label: ug,
  }));

  console.log(selectedGenre.value);

  const filteredBooks =
    selectedGenre.value === "All"
      ? books
      : books.filter((b) => b.genres.includes(selectedGenre.value));

  return (
    <div>
      <h2>books</h2>

      <div>
        Genre:
        <Select
          defaultValue={selectedGenre}
          onChange={setSelectedGenre}
          options={options}
        />
      </div>
      <BookList books={filteredBooks} />
    </div>
  );
};

export default Books;
