import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams
} from "react-router-dom";


function Switcher(){
  let location = useLocation();
  return (
    <div>
      <Switch location={location}>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/users/:userId">
          <UserInformation />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

function HomePage() {
  const [appState, setAppState] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = `https://jsonplaceholder.typicode.com/users`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then(
        (items) => {
          setAppState({ isLoaded: true, items: items });
        },
        (error) => {
          setAppState({
            isLoaded: true,
            error
          });
        }
      );
  }, [setAppState]);

  const { error, isLoaded, items } = appState;
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h2>List of users</h2>
        <ul>
          {items.map(item => (
            <li key={item.name}>
              <Link to={`/users/${item.id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

}

function UserInformation() {
  let { userId } = useParams();
  const [appState, setAppState] = useState({
    error: null,
    isLoaded: false,
    userInfo: [],
  });

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
    fetch(apiUrl, {method: "GET"})
        .then((res) => res.json())
        .then((userInfo) => {
            setAppState({ isLoaded: true, userInfo: userInfo });
          })
        .catch((error) => {
          setAppState({ isLoaded: true, error });
          });
    // eslint-disable-next-line
  }, [setAppState]);

  const { error, isLoaded, userInfo } = appState;
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h3>User Information</h3>
        <ul>
          <li>{userInfo.name}</li>
          <li>{userInfo.username}</li>
          <li>{userInfo.email}</li>
          <li>{userInfo.phone}</li>
          <li>{userInfo.company.name}</li>
          <li>{userInfo.website}</li>
          <li>address: 
            <ul>
              <li>{userInfo.address.street}</li>
              <li>{userInfo.address.suite}</li>
              <li>{userInfo.address.city}</li>
              <li>{userInfo.address.zipcode}</li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }

}

ReactDOM.render(
  <Router>
    <Switcher />
  </Router>,
  document.getElementById('root')
);
