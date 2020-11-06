import React, { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import Select from "react-select"

import { ALL_AUTHORS_QUERY, EDIT_BIRTH_YEAR } from "../queries"

const mapAuthorsToOptions = (authorsList) =>
  authorsList.map((author) => ({ value: author.name, label: author.name }))

const EditAuthorForm = ({ authors }) => {
  const [birthYear, setBirthYear] = useState("")
  const [selectedOption, setSelectedOption] = useState(null)

  /* useEffect(() => {}, []) */

  const [changeBirthYear] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS_QUERY }],
  })

  const submit = (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name: selectedOption.value, birthYear: Number(birthYear) } })
    setBirthYear("")
  }

  return (
    <div>
      <h2>change birth year</h2>

      <form onSubmit={submit}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={mapAuthorsToOptions(authors)}
        />
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
