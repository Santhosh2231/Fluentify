import axios from "axios";
import React, { useState,useReducer } from "react";
import Loading from "../components/Loading";

const dataReducer = (state, action) => {
    switch (action.type) {
      case 'SET_DATA':
        return { ...state, data: action.payload }
      default:
        return state
    }
  }
const Text = () => {
  const [text, setText] = useState("");
  const [state, dispatch] = useReducer(dataReducer, { data: null })
  const [load,setLoad] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmitClick = (e) =>{
    e.preventDefault();
     setLoad(true)
    axios.post('http://127.0.0.1:5000//api/correction',{"text":text})
        .then((response) => {
          dispatch({ type: 'SET_DATA', payload: response.data });
          console.log(response.data)
          setLoad(false)
        })
        .catch((error) => console.error("san: "+error))
  }

  return (
    
    <div className="w-full max-w-3xl mx-auto my-10 px-5 ">
    <h2 className="text-xl md:text-4xl mb-5">Grammar Correction - Text</h2>
        <h4 className="font-Inria text-2xl">Your Text: </h4>
      <textarea
        className="w-full h-60 p-4 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your text here..."
        value={text}
        onChange={handleTextChange}
      />
      {
        load? <Loading />:(<></>)
      }
      {
        state.data ? (<>
            <h4 className="font-Inria text-2xl">Corrected Text: </h4>
            <textarea
        className="w-full h-60 p-4 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your text here..."
        value={state.data.corrected_sentence}
        onChange={handleTextChange}
      /></>):(<div></div>)
      }
      
      <div className='flex justify-center items-center my-10'>
        <button type="submit" onClick={handleSubmitClick} className='border-4 rounded-lg text-white bg-teal-600 p-2' ><h4 className='text-2xl font-Inria text-white'>Check Grammar</h4></button>
      </div>
    </div>

  );
};

export default Text;
