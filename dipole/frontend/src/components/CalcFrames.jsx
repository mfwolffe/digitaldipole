import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/esm/CardBody";

const GLFrame = (response_json) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-around align-items-center">
        <Card className="bg-transparent">
          <CardBody>
            { response_json ? response_json['orig'] ?? "Loading..." : "Loading..." } // ... lol
          </CardBody>
        </Card>
        <Card className="bg-transparent">
          <CardBody>
            this is a card. inputs go here
          </CardBody>
        </Card>
        { window.MathJax.typeset() }
      </div>
    </>
  )
}

export default GLFrame
