import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router";

export const PrimaryButton = (props) => {
  const history = useHistory();
  const handleClick = () => {
    if (props.hasOwnProperty("onClick")) props.onClick();
    if (props.hasOwnProperty("to")) history.push(props.to);
  };

  return (
    <Button type="primary" shape="round" onClick={handleClick}>
      {props.text}
      {props.children}
    </Button>
  );
};
