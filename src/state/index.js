// -----------------------------------------------------------------------------

import { createStore } from "redux";

// -----------------------------------------------------------------------------

const INITIAL_STATE = {
  lang: "vi",
  user: undefined, // { id: undefined, token: undefined, name: undefined, avatar: undefined, facebook: undefined },
  time: 0 // timestamp
};

// -----------------------------------------------------------------------------

const reducer = (state, action) => {
  let newState = state;

  // DEBUG
  // console.log("reducer: old state = ", state, ", action = ", action);

  switch (action.type) {
    case "lang_update":
      {
        console.log("reducer: old state = ", state, ", action = ", action);
        newState = {
          ...state,
          lang: action.payload.newLang,
          time: Date.now()
        };
      }
      break;
    case "user_update":
      {
        newState = {
          ...state,
          user: action.payload,
          time: Date.now()
        };
      }
      break;
  }

  // DEBUG
  console.log("reducer: new state: ", newState);

  return newState;
};

// -----------------------------------------------------------------------------

export function initStore() {
  return createStore(reducer, INITIAL_STATE);
}

// -----------------------------------------------------------------------------
