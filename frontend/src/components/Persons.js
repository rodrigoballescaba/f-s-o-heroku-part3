import PersonDetail from "./PersonDetail";

const Persons = ({ filteredPersons, deleteName }) => (
    <>
        {filteredPersons.map((person, index) => (
            <PersonDetail key={index} person={person} deleteName={deleteName} />
        ))}
    </>
);

export default Persons