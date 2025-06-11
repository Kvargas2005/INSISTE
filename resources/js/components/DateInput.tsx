import React, { useState } from "react";

function DateInput() {
  const [date, setDate] = useState<string | undefined>();
  return (
    <>
    <input type="date" onChange={(e) => setDate(e.target.value)} />
    </>
  );
}
