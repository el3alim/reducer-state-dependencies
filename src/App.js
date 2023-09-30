// This component uses useReducer() to manage state.
// The component dispatches data pieces to reducer actions, which update the component's state.

// The initial state of the component is an object.
// It contains three key/pair values: "options" array of objects, "quantity of the selected item", and "selected".
import React from "react";

// The initial state of the component is an object that contains three key/pair values:
// * "options": an array of objects that represent the items that can be selected.
// * "quantity": the quantity of the selected item.
// * "selected": the ID of the selected item.
const initialState = {
  options: [
    { id: 1, name: "First", value: 10 },
    { id: 2, name: "Second", value: 50 },
    { id: 3, name: "Third", value: 200 },
  ],
  quantity: 1,
  selected: 1,
};

// A function that adds two key/pair values to the component's state:
// * "decrementDisabled": a boolean value that indicates whether the decrement button is disabled
// * "incrementDisabled": a boolean value that indicates whether the increment button is disabled
function reduceButtonStates(state) {
  return {
    ...state,
    decrementDisabled: state.quantity === 0,
    incrementDisabled: state.quantity === 10,
  };
}

// Another event handler function that finds the option object that matches the selected ID.
// It then calculates the total price of the selected items and adds it to the component's state as the "total" key/pair value.
function reduceTotal(state) {
  const option = state.options.find((option) => option.id === state.selected);
  return { ...state, total: state.quantity * option.value };
}

// The reducer() function.
// It takes in the state and action argument values passed from the return of this component.
// It then uses the "type" property value of the dispatched action to call several functions.
// The outcomes of the functions are then used to update the component's state.
function reducer(state, action) {
  // Declaring an empty object for use as a temporary state container.
  // The component's state is then updated with the newState through the reducer() functions.
  let newState;

  // A switch statement uses the "type" property of the dispatched action.
  // It compares the "type" property value to its cases and applies the matching case.
  switch (action.type) {
    // Case "init" is used to initialize the component on a new page load.
    // It sets the newState object to contain a copy of the component's state.
    // It then calls the reduceButtonStates function and gives it the newState as an argument.
    // The function in turn sets the initial component's state and adds the minimum and maximum limits of the increment/decrement buttons.
    case "init":
      newState = reduceTotal(state);
      return reduceButtonStates(newState);

    // Case "decrementQuantity" updates the newState object by decrementing the quantity by 1.
    // The updated newState is then passed to the reduceTotal() function, which calculates and adds the total key/pair value to the newState object.
    // The updated newState is then passed to the reduceButtons() to update the component's state.
    case "decrementQuantity":
      newState = { ...state, quantity: state.quantity - 1 };
      newState = reduceTotal(newState);
      return reduceButtonStates(newState);

    // Case "incrementQuantity" is a copy of the "decrementQuantity" case with only one difference.
    // It increments the quantity key/pair value of the newState and the component's state by 1 instead of decrementing it by 1.
    case "incrementQuantity":
      newState = { ...state, quantity: state.quantity + 1 };
      newState = reduceTotal(newState);
      return reduceButtonStates(newState);

    // Case "selectItem" updates the selected key/pair value of the newState.
    // It takes in the "id" value from the dispatched action and converts it to a number.
    // The newState object is updated with the new value.
    // The newState object is then passed to the reduceTotal() function, which calculates and adds the total key/pair value to the newState object.
    case "selectItem":
      newState = { ...state, selected: Number(action.id) };
      return reduceTotal(newState);
    // Case "default" is used to throw a message error whenever the actions' "type" roperty doesn't match any of the switch statements' cases.
    default:
      throw new Error(`${action.type} is not a valid action`);
  }
}

// Decalring and exporting the App component.
export default function App() {
  // Decalaring the useReducer() constant names, dispatching them to the reducer() functions' action argument, and assigning the initial state object to be used by the reducer() function as the state argument.
  const [
    {
      options,
      selected,
      quantity,
      total,
      decrementDisabled,
      incrementDisabled,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  // Dispatching the initial case to be used as the reducer() functions' action argument on page reload.
  // The useEffect() hook is used to make sure the dispatch is applied only once (avoid the native ReactJS response).
  React.useEffect(() => {
    dispatch({ type: "init" });
  }, []);

  // The App component return statement.
  return (
    // A fragmented JSX.
    <>
      {/*A buttons section including the increment and decrement buttons and a quantity display input.*/}
      <section>
        {/* A decrement value button. It is disabled when the decrementDisabled value is true (0). Onclick, "decrementQuantity" is dispatched to the reducer() function as the actions' "type" property. */}
        <button
          disabled={decrementDisabled}
          onClick={() => dispatch({ type: "decrementQuantity" })}
        >
          -
        </button>

        {/* An increment value button. It is disabled when the incrementDisabled value is true (10). Onclick, "incrementQuantity" is dispatched to the reducer() function as the actions' "type" property. */}
        <button
          disabled={incrementDisabled}
          onClick={() => dispatch({ type: "incrementQuantity" })}
        >
          +
        </button>

        {/* A read-only input that displays the updated quantity value of the components' state. */}
        <input readOnly value={quantity} />
      </section>

      {/* A section containing a dropdown menu to select items. */}
      <section>
        {/* The selected value of the components' state is displayed over the selected item. In the event of selection-change, The "selectItem" type property and the "id" property are dispatched to the reducer() functions' action argument. The "id" value is set to the selected items' id value. It is them compared at the "selectItem" case of the reducer() functions' switch statement. */}
        <select
          value={selected}
          onChange={(e) => dispatch({ type: "selectItem", id: e.target.value })}
        >
          {/* The selection of items is created by mapping through the options array-of-objects key/pair value of the initialState constant. Each items' "id" and "value" properties are set to the items' object "id" value, and the names' value is displayed over the selected item. */}
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </section>

      {/* A third section that only displays the "total" value of the components' state. */}
      <section>
        <strong>{total}</strong>
      </section>
    </>
  );
}
