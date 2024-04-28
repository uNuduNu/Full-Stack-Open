import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import { BOOK_ADDED, ALL_BOOKS } from "./components/queries";
import { useApolloClient, useSubscription } from "@apollo/client";

export const updateCache = (cache, query, addedBook) => {
  // Should probably use ids for unique checks, not title
  const makeUnique = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: makeUnique(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  // use subscription to catch books added by other users
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);

      window.alert(`added book ${addedBook.title}`);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("login");
  };

  const requireLogin = () => {
    return (
      <div>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token !== null && requireLogin()}
        <button onClick={() => (token === null ? setPage("login") : logout())}>
          {token === null ? "login" : "logout"}
        </button>
      </div>

      <Authors show={page === "authors"} allowSetBorn={token !== null} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page == "recommend"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
