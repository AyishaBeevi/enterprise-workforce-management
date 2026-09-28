import { useState, useEffect } from "react";

function EmployeeCard(props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("EmployeeCard loaded");
  }, []);

  return (
    <div>
      <h3>{props.name}</h3>
      <p>{props.department}</p>

      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}

export default EmployeeCard;