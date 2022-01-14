import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import { Spin } from "antd";

import "antd/dist/antd.min.css";

const App = lazy(() => import("./page"));

render(
  <Suspense fallback={<Spin />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
