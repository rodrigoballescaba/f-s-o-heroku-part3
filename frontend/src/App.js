import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newSearch, setNewSearch] = useState('')
    const [newMessage, setNewMessage] = useState(null)
    const [styleMessage, setStyleMessage] = useState(null)

    const notificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderColor: 'green',
        borderWidth: 5,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    const notificationErrorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 5,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    const addName = (event) => {
        event.preventDefault()

        const personObject = {
            name: newName,
            number: newNumber
        }

        const nameExists = persons.some((person) => person.name === newName);

        if (nameExists) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)) {
                const existingPerson = persons.find((person) => person.name === newName);
                personService
                    .update(existingPerson.id, personObject)
                    .then(updatedPerson => {
                        setStyleMessage(
                            'ok'
                        )
                        setNewMessage(
                            `Updated ${updatedPerson.name}`
                        )
                        setTimeout(() => {
                            setNewMessage(null)
                        }, 5000)
                        setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person));
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        console.error('Error updating person: ', error.response.data.error);
                        setStyleMessage(
                            'error'
                        )
                        setNewMessage(
                            error.response.data.error
                        )
                        setTimeout(() => {
                            setNewMessage(null)
                        }, 5000)
                    })
            }
            return;
        }

        personService
            .create(personObject)
            .then(createdPerson => {
                setStyleMessage(
                    'ok'
                )
                setNewMessage(
                    `Added ${createdPerson.name}`
                )
                setTimeout(() => {
                    setNewMessage(null)
                }, 5000)
                setPersons([...persons, createdPerson])
                setNewName('')
                setNewNumber('')

            })
            .catch(error => {
                console.error('Error creating person: ', error.response.data.error);
                setStyleMessage(
                    'error'
                )
                setNewMessage(
                    error.response.data.error
                )
                setTimeout(() => {
                    setNewMessage(null)
                }, 5000)
            })
    }

    const deleteName = (event, person) => {
        event.preventDefault()
        if (window.confirm(`Delete ${person.name} ?`)) {
            personService
                .deletePerson(person.id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== person.id));
                })
                .catch(error => {
                    console.error('Error deleting person: ', error.response.data.error);
                    setStyleMessage(
                        'error'
                    )
                    setNewMessage(
                        error.response.data.error
                    )
                    setTimeout(() => {
                        setNewMessage(null)
                    }, 5000)
                })
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSearchChange = (event) => {
        setNewSearch(event.target.value)
    }

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(newSearch.toLowerCase())
    );

    const hook = () => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
            .catch(error => {
                console.error('Error getting persons: ', error.response.data.error);
                setStyleMessage(
                    'error'
                )
                setNewMessage(
                    error.response.data.error
                )
                setTimeout(() => {
                    setNewMessage(null)
                }, 5000)
            });
    }

    useEffect(hook, [])

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification
                message={newMessage}
                notificationStyle={styleMessage === 'error' ? notificationErrorStyle : notificationStyle}
            />
            <Filter
                onChange={handleSearchChange}
            />
            <h2>Add a new</h2>
            <PersonForm
                addName={addName}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons
                filteredPersons={filteredPersons} deleteName={deleteName}
            />
        </div>
    )
}

export default App