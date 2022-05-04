export const Persons = ({filterKey, deletefunc}) => {
  return (
    filterKey.length !== 0 && (
      <ul>
        {
        filterKey.map(
          (person) => (
            <li key={person.name}>
              {person.name} {person.number} <button onClick={() => {deletefunc(person.id, person.name)}}> Delete </button>
            </li>
          )
        )}
      </ul>
    )
  )
}