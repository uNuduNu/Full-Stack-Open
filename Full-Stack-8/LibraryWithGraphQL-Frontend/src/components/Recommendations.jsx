import { useQuery } from "@apollo/client";
import { FAVORITE_BOOKS } from "./queries";
import BookList from "./BookList";

const Recommendations = (props) => {
  const result = useQuery(FAVORITE_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.favoriteBooks;

  return (
    <div>
      <h2>recommendations</h2>

      <BookList books={books} />
    </div>
  );
};

export default Recommendations;
