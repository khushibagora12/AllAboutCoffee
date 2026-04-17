// import * as React from 'react';
import { Html } from "@react-email/components";

export function Email({number}) {

  return (
    <Html lang="en">
      <p>Your validation number:</p>
      {number}
      <p>Enter this in your application</p>
    </Html>
  );
}