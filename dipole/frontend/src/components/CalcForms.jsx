import { useState, useEffect } from "react";

const TestForm = () => {
  const [eq, setEq] = useState("");

  useEffect(() => {
    req();
  }, []);

  const req = async () => {
    const response = await fetch("/api/eq");
    const json = await response.json();
    setEq(json);
  }

  // MathJax.typeset();

  useEffect(()=>{
    if( typeof window?.MathJax !== "undefined"){
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  },[eq])

  return (
    <>
      { eq }
      <p>$$q=m \cdot C \cdot D$$</p>
    </>
  )
}

export default TestForm;