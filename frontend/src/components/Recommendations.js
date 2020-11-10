import React from "react"

const Recommendations = ({ show, books, currentUser }) => {
  if (!show) {
    return null
  }
  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{currentUser.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => {
            const bookInCurrentGenre = book.genres.find(
              (genre) => genre.toLowerCase() === currentUser.favoriteGenre
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
    </div>
  )
}

export default Recommendations
