import React from "react"
import EditAuthorForm from "./EditAuthor"

const Authors = (props) => {
  const { authors } = props

  if (!props.show) {
    return null
  }

  if (authors.length === 0) {
    return <div>No authors</div>
  }

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
      <EditAuthorForm authors={authors} />
    </div>
  )
}

export default Authors
