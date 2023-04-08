import './App.css';
import React, { useState,useReducer } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import Speech from 'react-speech';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faStop,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload }
    default:
      return state
  }
}

const Dictaphone = () => {
  const [load,setLoad] = useState(false);
  const [state, dispatch] = useReducer(dataReducer, { data: null })
  const [synth, setSynth] = useState(null);
  const { speak } = useSpeechSynthesis();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [continuousListening, setContinuousListening] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startListening = () => {
    setContinuousListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    setContinuousListening(false);
    SpeechRecognition.stopListening();
  };

  const speakTranscript = () => {
    const speech = new SpeechSynthesisUtterance(transcript);
    window.speechSynthesis.speak(speech);
  };

  const handleSubmitClick = (e) =>{
    e.preventDefault();
     setLoad(true)
    axios.post('http://127.0.0.1:5000//api/correction',{"text":transcript})
        .then((response) => {
          dispatch({ type: 'SET_DATA', payload: response.data });
          console.log(response.data)
          setLoad(false)
          speak({text:response.data.corrected_sentence})
        })
        .catch((error) => console.error("san: "+error))
  }

  return (
    <div className="mt-10">
      <div className="box md:w-1/2 w-full m-auto">
        <p className="microphone-status">
          Microphone: {listening ? 'on' : 'off'}
        </p>
        <button className="btn" onClick={startListening} disabled={continuousListening}>
          <FontAwesomeIcon icon={faMicrophone} className="icon" />
          Start
        </button>
        <button className="btn" onClick={stopListening} disabled={!continuousListening}>
          <FontAwesomeIcon icon={faStop} className="icon" />
          Stop
        </button>
        <button className="btn" onClick={resetTranscript}>
          <FontAwesomeIcon icon={faUndo} className="icon" />
          Reset
        </button>
      </div>
      <div className='w-full m-auto md:w-1/2'>
      <h4 className="font-Inria text-2xl">Text: </h4>
      <textarea
        className="w-full  h-28 p-4 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your text here..."
        value={transcript}
     
      /></div>
      {
        load? <Loading />:(<></>)
      }
      {
        state.data ? (<div className='w-full m-auto md:w-1/2'>
            <h4 className="font-Inria text-2xl">Corrected Text: </h4>
            <textarea
        className="w-full  h-28 p-4 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your text here..."
        value={state.data.corrected_sentence}
       
      /></div>):(<div></div>)
      }
      
      <div className='flex justify-center items-center my-10'>
        <button type="submit" onClick={handleSubmitClick} className='border-4 rounded-lg text-white bg-teal-600 p-2' ><h4 className='text-2xl font-Inria text-white'>Check Grammar</h4></button>
        <button onClick={speakTranscript}  className='border-4 rounded-lg text-white bg-teal-600 p-2'><h4 className='text-2xl font-Inria text-white'>Text to Speech</h4></button>
      </div>
      
      
    </div>
  );
};
export default Dictaphone;