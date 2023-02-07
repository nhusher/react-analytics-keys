# `react-analytics-keys`

Quickly and easily generate unique and reasonably-stable analytics attributes for integrating with user-behavior tracking apps like Heap or Pendo.

## Installation

```sh
npm install react-analytics-keys
```

## Usage

### Use `useAnalyticsKeyBuilder` to generate analytics keys:

```jsx
import {AnalyticsNode, useAnalyticsKeyBuilder} from "./index";

function Todo({info}) {
  const keyBuilder = useAnalyticsKeyBuilder('todo');
  
  return (
    <div {...keyBuilder()}>
      <p>{todo.text}</p>
      <button {...keyBuilder('edit')}>Update Item</button>
      <button {...keyBuilder('remove')}>Remove Item</button>
    </div>
  );
}

function App() {
  return (
    <AnalyticsNode value="todos-app">
      <h1>Todo Application</h1>
      <AnalyticsNode value="todo-list">
        <ul>
          {todos.map(t => <li key={t.id}><Todo info={t}/></li>)}
        </ul>
      </AnalyticsNode>
    </AnalyticsNode>
  );
}
```

By default, this might render something like:

```html
<h1>Todo Application</h1>
<ul>
  <li>
    <div data-analytics="todos-app/todos-list/todo">
      <p>Get groceries</p>
      <button data-analytics="todos-app/todos-list/todo/edit">Update Item</button>
      <button data-analytics="todos-app/todos-list/todo/remove">Remove Item</button>
    </div>
  </li>
</ul>
```

### Use `AnalyticsContextProvider` to change the way that analytics keys are generated:

Let's say that `data-analytics` is too generic, or slash delimiters are inappropriate. In this case, you can override the key generation behavior by specifying a new configuration function:

```tsx
import {AnalyticsContextProvider} from "./index";

function myKeyGenerator(names: readonly string[]): Record<string, string> {
  return {
    'data-heap-id': names.join(':'),
    'data-heap-enabled': true
  };
}

function App() {
  return (
    <AnalyticsContextProvider value={myKeyGenerator}>
      <h1>Todo Application</h1>
      ...
    </AnalyticsContextProvider>
  );
}
```

This might render like:

```html
<h1>Todo Application</h1>
<ul>
  <li>
    <div data-heap-id="todos-app:todos-list:todo" data-heap-enabled>
      <p>Get groceries</p>
      <button data-heap-id="todos-app:todos-list:todo:edit" data-heap-enabled>Update Item</button>
      <button data-heap-id="todos-app:todos-list:todo:remove" data-heap-enabled>Remove Item</button>
    </div>
  </li>
</ul>
```


## Rationale

User behavior tracking tools like Heap insert themselves into the DOM and use this position of power to scoop up almost all user behavior. Clicks, page changes, window resizes, etc. This sounds like a performance and compatibility nightmare, but somehow they pull it off ok. These apps can aggregate this information just-in-time: if the BI team is interested in how many users clicked a button, they can find a unique selector for that button and add instrumentation without an additional code deployment.

Modern React applications are resistant to this sort of tracking. Many React apps use Styled Components (or similar technologies) that use opaque hashes for their class names. This technology massively improves developer productivity, but one important side effect is that class names are for machines and not for people. CSS class names aren't guaranteed to be consistent between builds.

More generally, though, web applications tend to change significantly over time. This means that CSS selectors (like button.some-class-name) will tend to quietly become invalid. Practically-speaking **CSS selectors aren't an external contract.** This is similar to how a grocery store's physical layout isn't a contract: the managers of a grocery store may change the layout at will, moving products as necessary, as long as the aisle indexes remain correct (the signs saying things like "Frozen Foods" and "Baking Needs").

We need to make "aisle indexes" for elements in our app so that selecting UI elements does not break, or breaks far less frequently. `react-analytics-keys` attempts to solve this problem by tying analytics keys to the semantic structure of an application.