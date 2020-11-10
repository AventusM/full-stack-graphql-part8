import React, { useState } from "react"

const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState("all")
  const { books } = props
  if (!props.show) {
    return null
  }

  const allGenres = books.flatMap((b) => b.genres.map((g) => g.toLowerCase()))
  const uniqueGenres = new Set(allGenres)

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <b>{currentGenre}</b>{" "}
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => {
            console.log("book genres", book.genres)
            const bookInCurrentGenre = book.genres.find(
              (genre) => genre.toLowerCase() === currentGenre || currentGenre === "all"
            )
            return (
              bookInCurrentGenre && (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              )
            )
          })}
        </tbody>
      </table>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          display: "flex",
        }}
      >
        <button onClick={() => setCurrentGenre("all")}>all</button>
        {[...uniqueGenres].map((genre) => (
          <li key={genre}>
            <button onClick={() => setCurrentGenre(genre)}>{genre}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Books
