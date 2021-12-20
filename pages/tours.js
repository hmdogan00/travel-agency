import { useEffect, useState } from "react";
import { Flag } from "semantic-ui-react";
import Navbar from "./Navbar";

function Tours() {
  const [alist, setAList] = useState([]);
  useEffect(() => {
    const arr = [];
    for (var i = 0; i < 5000; i++) {
      arr.push(i);
    }
    setAList(arr);
  }, [])

  return (
    <>
      <Navbar activeType="tours" />
      {
        alist.map(() => {
          return <Flag name='tr' />
        })
      }
    </>
  );
}

export default Tours;
