import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import endpoint from './endpoint';

import './styles.scss';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  // debugger;
  if (action.type === 'LOADING') {
    return {
      result: null,
      loading: true,
      error: null,
    };
  }
  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      result: action.payload.response,
      loading: false,
      error: null,
    };
  }
  if (action.type === 'ERROR') {
    return {
      result: null,
      loading: false,
      error: action.payload.error,
    };
  }
  return state; // we should not see this
};

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  useEffect(() => {
    dispatch({ type: 'LOADING' });

    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: 'RESPONSE_COMPLETE',
          payload: {
            response: response.results,
          },
        });
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: { error } });
      });
  }, [url]);

  return [state.result, state.loading, state.error];
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = response || [];
  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error.message}</p>}
          <CharacterList characters={characters} />
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
