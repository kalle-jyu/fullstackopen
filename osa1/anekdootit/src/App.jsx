import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const [selected, setSelected] = useState(0)

  const [mostvoted, setMostVoted] = useState(0)

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1

    if (copy[selected] > copy[mostvoted]) {
      setMostVoted(selected)
    }

    setPoints(copy)
  }

  return (
    <div>
      <h1>Anectode of the day</h1>
      <p>{anecdotes[selected]}</p>
      <VoteButton text="Vote" selected={selected} callback={vote} />
      <RandomButton text="Random anectode" anecdotes={anecdotes} callback={setSelected} />
      <MostVotes anecdotes={anecdotes} points={points} mostvoted={mostvoted} />
    </div>
  )
}

const VoteButton = ({ text, selected, callback }) => {
  return (
    <button onClick={() => callback(selected)}>
      {text}
    </button>
  )
}

const RandomButton = ({ text, anecdotes, callback }) => {
  return (
    <button onClick={() => callback((Math.floor(Math.random() * anecdotes.length)))}>
      {text}
    </button>
  )
}


const MostVotes = ({ anecdotes, points, mostvoted }) => {
  if (points[mostvoted] > 0)
    return (
      <div>
        <h1>Anectode with most votes</h1>
        <p>{anecdotes[mostvoted]} <br />has {points[mostvoted]} votes</p>
      </div>
    )
}

export default App

