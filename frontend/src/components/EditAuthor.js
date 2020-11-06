import React, { useState } from "react"
import { useMutation } from "@apollo/client"

import { ALL_AUTHORS_QUERY, EDIT_BIRTH_YEAR } from "../queries"

const EditAuthorForm = () => {
  const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState("")

  const [changeBirthYear] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS_QUERY }],
  })
  const submit = (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name, birthYear: Number(birthYear) } })
    setName("")
    setBirthYear("")
  }

  return (
    <div>
      <h2>change birth year</h2>

      <form onSubmit={submit}>
        <div>
          name{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          birth year{" "}
          <input
            value={birthYear}
            type="number"
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">change birth year</button>
      </form>
    </div>
  )
}

export default EditAuthorForm
