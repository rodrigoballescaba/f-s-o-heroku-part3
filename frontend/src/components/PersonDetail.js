const PersonDetail = ({ person, deleteName }) => (
    <>
        <p>{person.name} {person.number} <button onClick={(event) => deleteName(event, person)}>delete</button></p>
    </>
);

export default PersonDetail