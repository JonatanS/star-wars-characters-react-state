import React, { useCallback, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import isFunction from 'lodash/isFunction';

import CharacterList from './CharacterList';

import endpoint from './endpoint';

import './styles.scss';

const initialState = {
  characters: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }
  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }
  if (action.type === 'ERROR') {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }
  return state; // we should not see this
};

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback(
    (action) => {
      if (isFunction(action)) action(dispatch);
      else dispatch(action);
    },
    [dispatch],
  );
  return [state, enhancedDispatch];
};

const fetchCharacters = (dispatch) => {
  dispatch({ type: 'LOADING' });
  fetch(endpoint + '/characters')
    .then((response) => response.json())
    .then((response) => {
      dispatch({
        type: 'RESPONSE_COMPLETE',
        payload: {
          characters: response.results,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: 'ERROR',
        payload: error,
      });
    });
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = state;

  useEffect(() => {
    dispatch((dispatch) => {});
  }, [dispatch]);

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button onClick={() => dispatch(fetchCharacters)}>
            Load Characters
          </button>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="error">{error.message}</p>} */}
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
